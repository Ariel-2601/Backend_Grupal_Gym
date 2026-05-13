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
    // Cargar ventas
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
                .order("fecha_venta", { ascending: false }); // Más recientes primero

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
                setToast({
                    mostrar: true,
                    mensaje: "Debe seleccionar un cliente.",
                    tipo: "warning"
                });
                return;
            }

            const { error } = await supabase
                .from("ventas")
                .insert([{
                    id_cliente: nuevaVenta.id_cliente,
                    total: nuevaVenta.total,
                    metodo_pago: nuevaVenta.metodo_pago,
                    fecha_venta: nuevaVenta.fecha_venta || new Date().toISOString().split('T')[0]
                }]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Venta registrada correctamente.",
                tipo: "success"
            });

            setMostrarModal(false);
            await cargarVentas();   // Recargar para ver el cliente

        } catch (error) {
            console.log("Error al registrar venta:", error);
            setToast({
                mostrar: true,
                mensaje: "Error al registrar venta.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Actualizar Venta
    // =========================
    const actualizarVenta = async (ventaActualizada) => {
        try {
            const { error } = await supabase
                .from("ventas")
                .update({
                    id_cliente: ventaActualizada.id_cliente,
                    total: ventaActualizada.total,
                    metodo_pago: ventaActualizada.metodo_pago,
                    fecha_venta: ventaActualizada.fecha_venta
                })
                .eq("id_venta", ventaActualizada.id_venta);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Venta actualizada correctamente.",
                tipo: "success"
            });

            setMostrarModalEdicion(false);
            await cargarVentas();

        } catch (error) {
            console.log(error);
            setToast({
                mostrar: true,
                mensaje: "Error al actualizar venta.",
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

            setToast({
                mostrar: true,
                mensaje: "Venta eliminada correctamente.",
                tipo: "success"
            });

            setMostrarModalEliminacion(false);
            await cargarVentas();

        } catch (error) {
            console.log(error);
            setToast({
                mostrar: true,
                mensaje: "Error al eliminar venta.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Buscar ventas
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

            {ventasFiltradas.length === 0 && (
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

            {/* Modales */}
            <ModalRegistroVenta
                mostrar={mostrarModal}
                setMostrar={setMostrarModal}
                agregarVenta={agregarVenta}
            />

            <ModalEdicionVenta
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                venta={ventaSeleccionada}
                actualizarVenta={actualizarVenta}
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