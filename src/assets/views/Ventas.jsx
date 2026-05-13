/* eslint-disable react-hooks/set-state-in-effect */

import React, {
    useState,
    useEffect
} from "react";

import {
    Container,
    Row,
    Col,
    Button,
    Alert
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroVenta from "../components/ventas/ModalRegistroVenta";
import ModalEdicionVenta from "../components/ventas/ModalEdicionVenta";
import ModalEliminacionVenta from "../components/ventas/ModalEliminacionVenta";

import TablaVentas from "../components/ventas/TablaVentas";
import TarjetaVentas from "../components/ventas/TarjetaVenta";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Ventas = () => {

    // =========================
    // Estados
    // =========================
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

    const [ventas, setVentas] = useState([]);
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
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
    // Cargar Clientes
    // =========================
    const cargarClientes = async () => {
        try {
            const { data, error } = await supabase
                .from("clientes")
                .select("id_cliente, nombres, apellidos")
                .order("nombres", { ascending: true });

            if (error) {
                console.error("Error al cargar clientes:", error);
                return;
            }

            setClientes(data || []);
        } catch (error) {
            console.error("Excepción al cargar clientes:", error);
        }
    };

    // =========================
    // Cargar Productos
    // =========================
    const cargarProductos = async () => {
        try {
            const { data, error } = await supabase
                .from("productos")
                .select("id_producto, nombre_producto, precio")
                .order("nombre_producto");

            if (error) throw error;

            setProductos(data || []);
            console.log("✅ Productos cargados:", data?.length);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    // =========================
    // Cargar Ventas
    // =========================
    const cargarVentas = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("ventas")
                .select(`
                    *,
                    clientes (
                        nombres,
                        apellidos
                    ),
                    detalle_ventas (
                        cantidad,
                        productos (
                            nombre_producto
                        )
                    )
                `)
                .order("fecha_venta", { ascending: false });

            if (error) throw error;

            setVentas(data || []);
            setVentasFiltradas(data || []);

        } catch (error) {
            console.log("Error al cargar ventas:", error);
            setToast({
                mostrar: true,
                mensaje: "Error al cargar ventas.",
                tipo: "danger"
            });
        } finally {
            setCargando(false);
        }
    };

    // =========================
    // Registrar Venta
    // =========================
const agregarVenta = async (nuevaVenta) => {
    try {
        if (!nuevaVenta.id_cliente) {
            setToast({ mostrar: true, mensaje: "Debe seleccionar un cliente.", tipo: "warning" });
            return;
        }

        if (!nuevaVenta.productos || nuevaVenta.productos.length === 0) {
            setToast({ mostrar: true, mensaje: "Debe agregar al menos un producto.", tipo: "warning" });
            return;
        }

        // 1. Insertar la venta principal
        const { data: ventaInsertada, error: errorVenta } = await supabase
            .from("ventas")
            .insert([{
                id_cliente: nuevaVenta.id_cliente,
                total: nuevaVenta.total,
                metodo_pago: nuevaVenta.metodo_pago,
                fecha_venta: nuevaVenta.fecha_venta || new Date().toISOString().split('T')[0]
            }])
            .select()
            .single();

        if (errorVenta) throw errorVenta;

        // 2. Insertar los detalles (productos) - SIN precio_unitario
        const nuevosDetalles = nuevaVenta.productos.map(prod => ({
            id_venta: ventaInsertada.id_venta,
            id_producto: prod.id_producto,
            cantidad: parseInt(prod.cantidad) || 1
            // NO incluimos precio_unitario porque no existe en la tabla
        }));

        const { error: errorDetalles } = await supabase
            .from("detalle_ventas")
            .insert(nuevosDetalles);

        if (errorDetalles) throw errorDetalles;

        setToast({ 
            mostrar: true, 
            mensaje: "Venta registrada correctamente con productos.", 
            tipo: "success" 
        });

        setMostrarModal(false);
        await cargarVentas(); // Recargar para ver los productos

    } catch (error) {
        console.error("Error al registrar venta:", error);
        setToast({ 
            mostrar: true, 
            mensaje: "Error al registrar la venta.", 
            tipo: "danger" 
        });
    }
};

// =========================
// Actualizar Venta 
// =========================
const actualizarVenta = async (ventaActualizada) => {
    try {
        if (!ventaActualizada.id_cliente || !ventaActualizada.id_venta) {
            setToast({
                mostrar: true,
                mensaje: "Datos incompletos para actualizar.",
                tipo: "warning"
            });
            return;
        }

        // 1. Actualizar la venta principal
        const { error: errorVenta } = await supabase
            .from("ventas")
            .update({
                id_cliente: ventaActualizada.id_cliente,
                total: parseFloat(ventaActualizada.total) || 0,
                metodo_pago: ventaActualizada.metodo_pago,
                fecha_venta: ventaActualizada.fecha_venta
            })
            .eq("id_venta", ventaActualizada.id_venta);

        if (errorVenta) throw errorVenta;

        // 2. Eliminar detalles antiguos
        await supabase
            .from("detalle_ventas")
            .delete()
            .eq("id_venta", ventaActualizada.id_venta);

        // 3. Insertar nuevos detalles (SIN precio_unitario)
        if (ventaActualizada.productos && ventaActualizada.productos.length > 0) {
            const nuevosDetalles = ventaActualizada.productos.map(prod => ({
                id_venta: ventaActualizada.id_venta,
                id_producto: prod.id_producto,
                cantidad: parseInt(prod.cantidad) || 1
            }));

            const { error: errorDetalles } = await supabase
                .from("detalle_ventas")
                .insert(nuevosDetalles);

            if (errorDetalles) throw errorDetalles;
        }

        setToast({
            mostrar: true,
            mensaje: "Venta actualizada correctamente.",
            tipo: "success"
        });

        setMostrarModalEdicion(false);
        await cargarVentas();

    } catch (error) {
        console.error("Error al actualizar venta:", error);
        setToast({
            mostrar: true,
            mensaje: "Error al actualizar la venta.",
            tipo: "danger"
        });
    }
};

    // =========================
    // Eliminar Venta
    // =========================
    const eliminarVenta = async (id) => {
        try {
            const { error } = await supabase
                .from("ventas")
                .delete()
                .eq("id_venta", id);

            if (error) throw error;

            setToast({ mostrar: true, mensaje: "Venta eliminada correctamente.", tipo: "success" });
            setMostrarModalEliminacion(false);
            await cargarVentas();

        } catch (error) {
            console.log("Error al eliminar venta:", error);
            setToast({ mostrar: true, mensaje: "Error al eliminar venta.", tipo: "danger" });
        }
    };

    // =========================
    // Búsqueda
    // =========================
    const handleBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);

        const resultados = ventas.filter((venta) => {
            const nombreCliente = `${venta.clientes?.nombres || ''} ${venta.clientes?.apellidos || ''}`.toLowerCase();
            return (
                venta.metodo_pago?.toLowerCase().includes(texto) ||
                venta.total?.toString().includes(texto) ||
                nombreCliente.includes(texto) ||
                venta.detalle_ventas?.some(detalle =>
                    detalle.productos?.nombre_producto?.toLowerCase().includes(texto)
                )
            );
        });

        setVentasFiltradas(resultados);
    };

    // =========================
    // useEffect
    // =========================
    useEffect(() => {
        cargarVentas();
        cargarClientes();
        cargarProductos();
    }, []);

    // =========================
    // Render
    // =========================
    return (
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col xs={9}>
                    <h3 className="mb-0">
                        <i className="bi bi-cart-fill me-2"></i>
                        Ventas
                    </h3>
                </Col>
                <Col xs={3} className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
                        <i className="bi bi-plus-lg"></i>
                        <span className="ms-2 d-none d-sm-inline">Nueva Venta</span>
                    </Button>
                </Col>
            </Row>

            <hr />

            <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                onChange={handleBusqueda}
            />

            {ventasFiltradas.length === 0 && !cargando && (
                <Alert variant="warning">No se encontraron ventas.</Alert>
            )}

            {/* Tabla en PC */}
            <div className="d-none d-md-block">
                <TablaVentas
                    ventas={ventasFiltradas}
                    cargando={cargando}
                    onEditar={(venta) => {
                        setVentaSeleccionada(venta);
                        setMostrarModalEdicion(true);
                    }}
                    onEliminar={(venta) => {
                        setVentaSeleccionada(venta);
                        setMostrarModalEliminacion(true);
                    }}
                />
            </div>

            {/* Tarjetas en Celular */}
            <div className="d-block d-md-none">
                <TarjetaVentas
                    ventas={ventasFiltradas}
                    onEditar={(venta) => {
                        setVentaSeleccionada(venta);
                        setMostrarModalEdicion(true);
                    }}
                    onEliminar={(venta) => {
                        setVentaSeleccionada(venta);
                        setMostrarModalEliminacion(true);
                    }}
                />
            </div>

            {/* ==================== MODALES ==================== */}
            <ModalRegistroVenta
                mostrar={mostrarModal}
                setMostrar={setMostrarModal}
                agregarVenta={agregarVenta}
                clientes={clientes}
                productos={productos}
            />

      <ModalEdicionVenta
    mostrar={mostrarModalEdicion}
    setMostrar={setMostrarModalEdicion}
    venta={ventaSeleccionada}
    actualizarVenta={actualizarVenta}
    clientes={clientes}
    productos={productos}
/>

            <ModalEliminacionVenta
                mostrar={mostrarModalEliminacion}
                setMostrar={setMostrarModalEliminacion}
                venta={ventaSeleccionada}
                eliminarVenta={eliminarVenta}
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

export default Ventas;