/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Button
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroCliente from "../components/clientes/ModalRegistroClientes";
import ModalEdicionClientes from "../components/clientes/ModalEdicionClientes";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionClientes";

import TablaClientes from "../components/clientes/TablaClientes";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Clientes = () => {

    // =========================
    // Estados
    // =========================

    const [mostrarModal, setMostrarModal] = useState(false);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

    const [clientes, setClientes] = useState([]);

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const [cargando, setCargando] = useState(false);

    // =========================
    // Toast
    // =========================

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    // =========================
    // Cargar clientes
    // =========================

    const cargarClientes = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("clientes")
                .select("*")
                .order("id_cliente", { ascending: true });

            if (error) throw error;

            setClientes(data || []);

        } catch (error) {

            console.log("Error al cargar clientes:", error);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar clientes.",
                tipo: "danger"
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // Agregar cliente
    // =========================

    const agregarCliente = async (nuevoCliente) => {

        try {

            if (!nuevoCliente.nombres.trim()) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe ingresar el nombre.",
                    tipo: "warning"
                });

                return;
            }

            const { error } = await supabase
                .from("clientes")
                .insert([
                    {
                        nombres: nuevoCliente.nombres,
                        apellidos: nuevoCliente.apellidos,
                        edad: nuevoCliente.edad,
                        telefono: nuevoCliente.telefono,
                        correo: nuevoCliente.correo,
                        estado: nuevoCliente.estado
                    }
                ]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Cliente registrado correctamente.",
                tipo: "success"
            });

            setMostrarModal(false);

            await cargarClientes();

        } catch (error) {

            console.log("Error al registrar:", error);

            setToast({
                mostrar: true,
                mensaje: "Error al registrar cliente.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Actualizar cliente
    // =========================

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
                estado: clienteActualizado.estado
            })
            .eq("id_cliente", clienteActualizado.id_cliente);

        if (error) throw error;

        // ✅ ÉXITO
        setToast({
            mostrar: true,
            mensaje: "Cliente actualizado correctamente.",
            tipo: "success"        // ← Debe ser "success"
        });

        setMostrarModalEdicion(false);
        await cargarClientes();

    } catch (error) {
        console.error("Error al actualizar:", error);
        
        setToast({
            mostrar: true,
            mensaje: "Error al actualizar cliente.",
            tipo: "danger"
        });
    }
};

    // =========================
    // Eliminar cliente
    // =========================

    const eliminarCliente = async (id) => {

        try {

            const { error } = await supabase
                .from("clientes")
                .delete()
                .eq("id_cliente", id);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Cliente eliminado correctamente.",
                tipo: "success"
            });

            setMostrarModalEliminacion(false);

            await cargarClientes();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al eliminar cliente.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // useEffect
    // =========================

    useEffect(() => {
        cargarClientes();
    }, []);

    // =========================
    // Render
    // =========================

    return (

        <Container className="mt-3">

            {/* Encabezado */}
            <Row className="align-items-center mb-3">

                <Col xs={9}>

                    <h3 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i>
                        Clientes
                    </h3>

                </Col>

                <Col xs={3} className="text-end">

                    <Button
                        onClick={() => setMostrarModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i>

                        <span className="ms-2 d-none d-sm-inline">
                            Nuevo Cliente
                        </span>
                    </Button>

                </Col>

            </Row>

            <hr />

            {/* Tabla */}
<TablaClientes
    clientes={clientes}
    cargando={cargando}
    onEditar={(cliente) => {
        setClienteSeleccionado(cliente);
        setMostrarModalEdicion(true);
    }}
    onEliminar={(cliente) => {
        setClienteSeleccionado(cliente);
        setMostrarModalEliminacion(true);
    }}
/>
            {/* Modal Registro */}
            <ModalRegistroCliente
                mostrar={mostrarModal}
                setMostrar={setMostrarModal}
                agregarCliente={agregarCliente}
            />

            {/* Modal Edición */}
            <ModalEdicionClientes
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                cliente={clienteSeleccionado}
                actualizarCliente={actualizarCliente}
            />

            {/* Modal Eliminación */}
            <ModalEliminacionCliente
                mostrar={mostrarModalEliminacion}
                setMostrar={setMostrarModalEliminacion}
                cliente={clienteSeleccionado}
                eliminarCliente={eliminarCliente}
            />

            {/* Toast */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false
                    })
                }
            />

        </Container>
    );
};

export default Clientes;