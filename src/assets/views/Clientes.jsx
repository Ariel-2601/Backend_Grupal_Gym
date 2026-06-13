
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroCliente from "../components/clientes/ModalRegistroClientes";
import ModalEdicionClientes from "../components/clientes/ModalEdicionClientes";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionClientes";

import TablaClientes from "../components/clientes/TablaClientes";

import NotificacionOperacion from "../components/NotificacionOperacion";
import TarjetaClientes from "../components/clientes/TarjetaClientes";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Clientes = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });
      if (error) throw error;
      setClientes(data || []);
      setClientesFiltrados(data || []);
    } catch (error) {
      console.log("Error al cargar clientes:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar clientes.",
        tipo: "danger",
      });
    } finally {
      setCargando(false);
    }
  };

  const agregarCliente = async (nuevoCliente) => {
    try {
      if (!nuevoCliente.nombres.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe ingresar el nombre.",
          tipo: "warning",
        });
        return;
      }

      const { data, error } = await supabase
        .from("clientes")
        .insert([{
          nombres: nuevoCliente.nombres,
          apellidos: nuevoCliente.apellidos,
          edad: nuevoCliente.edad,
          telefono: nuevoCliente.telefono,
          correo: nuevoCliente.correo,
          estado: nuevoCliente.estado,
        }])
        .select()
        .single();

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Cliente registrado correctamente.",
        tipo: "success",
      });

      setMostrarModal(false);
      await cargarClientes();

      navigate(`/membresias-clientes?cliente_id=${data.id_cliente}&nombre=${encodeURIComponent(data.nombres + " " + data.apellidos)}`);

    } catch (error) {
      console.log("Error al registrar:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al registrar cliente.",
        tipo: "danger",
      });
    }
  };

  const actualizarCliente = async (clienteActualizado) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          nombres: clienteActualizado.nombres,
          apellidos: clienteActualizado.apellidos,
          edad: clienteActualizado.edad,
          telefono: clienteActualizado.telefono,
          correo: clienteActualizado.correo,
          estado: clienteActualizado.estado,
        })
        .eq("id_cliente", clienteActualizado.id_cliente);
      if (error) throw error;
      setToast({
        mostrar: true,
        mensaje: "Cliente actualizado correctamente.",
        tipo: "success",
      });
      setMostrarModalEdicion(false);
      await cargarClientes();
    } catch (error) {
      console.error("Error al actualizar:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar cliente.",
        tipo: "danger",
      });
    }
  };

  const generarPDFCliente = (cliente) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Cliente", 14, 20);
    doc.line(14, 25, 195, 25);
    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", cliente.id_cliente],
        ["Nombres", cliente.nombres],
        ["Apellidos", cliente.apellidos],
        ["Edad", cliente.edad],
        ["Teléfono", cliente.telefono],
        ["Correo", cliente.correo],
        ["Estado", cliente.estado],
      ],
    });
    doc.save(`cliente_${cliente.id_cliente}.pdf`);
  };

  // =========================
  // Eliminar cliente + membresías
  // =========================
  const eliminarCliente = async (id) => {
    try {
      // 1. Primero eliminar las membresías asociadas al cliente
      const { error: errorMembresias } = await supabase
        .from("membresias_clientes")
        .delete()
        .eq("cliente_id", id);

      if (errorMembresias) {
        console.log("Error al eliminar membresías:", errorMembresias);
        throw new Error("Error al eliminar membresías del cliente");
      }

      // 2. Luego eliminar el cliente
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", id);

      if (error) throw error;

      // El toast se maneja desde el modal (animación de éxito)
      // Pero por si acaso, actualizamos la lista
      await cargarClientes();

      return true; // Éxito
    } catch (error) {
      console.log(error);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar cliente y sus membresías.",
        tipo: "danger",
      });
      return false; // Error
    }
  };

  const handleBusqueda = (e) => {
    const texto = e.target.value;
    setTextoBusqueda(texto);
    const resultados = clientes.filter((cliente) =>
      cliente.nombres.toLowerCase().includes(texto.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(texto.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(resultados);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Clientes
          </h3>
        </Col>
        <Col xs="auto" className="ms-auto">
          <Button onClick={() => setMostrarModal(true)} className="px-3">
            <i className="bi bi-plus-lg"></i>
            <span className="ms-2 d-none d-sm-inline">Nuevo Cliente</span>
          </Button>
        </Col>
      </Row>
      <hr />
      <CuadroBusquedas textoBusqueda={textoBusqueda} onChange={handleBusqueda} />
      {clientesFiltrados.length === 0 && (
        <Alert variant="danger">No se encontraron clientes.</Alert>
      )}
      <div className="d-block d-lg-none">
        <TarjetaClientes
          clientes={clientesFiltrados}
          onEditar={(cliente) => {
            setClienteSeleccionado(cliente);
            setMostrarModalEdicion(true);
          }}
          onEliminar={(cliente) => {
            setClienteSeleccionado(cliente);
            setMostrarModalEliminacion(true);
          }}
        />
      </div>
      <div className="d-none d-lg-block">
        <TablaClientes
          clientes={clientesFiltrados}
          cargando={cargando}
          generarPDFCliente={generarPDFCliente}
          onEditar={(cliente) => {
            setClienteSeleccionado(cliente);
            setMostrarModalEdicion(true);
          }}
          onEliminar={(cliente) => {
            setClienteSeleccionado(cliente);
            setMostrarModalEliminacion(true);
          }}
        />
      </div>
      <ModalRegistroCliente
        mostrar={mostrarModal}
        setMostrar={setMostrarModal}
        agregarCliente={agregarCliente}
      />
      <ModalEdicionClientes
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        cliente={clienteSeleccionado}
        actualizarCliente={actualizarCliente}
      />
      <ModalEliminacionCliente
        mostrar={mostrarModalEliminacion}
        setMostrar={setMostrarModalEliminacion}
        cliente={clienteSeleccionado}
        eliminarCliente={eliminarCliente}
      />
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Clientes;