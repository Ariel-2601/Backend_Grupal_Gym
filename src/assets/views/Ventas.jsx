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
    Alert,
    Pagination
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
    // Paginación
    // =========================
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 8;

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
            setPaginaActual(1);

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

            const nuevosDetalles = nuevaVenta.productos.map(prod => ({
                id_venta: ventaInsertada.id_venta,
                id_producto: prod.id_producto,
                cantidad: parseInt(prod.cantidad) || 1
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
            await cargarVentas();

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

            await supabase
                .from("detalle_ventas")
                .delete()
                .eq("id_venta", ventaActualizada.id_venta);

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
        setPaginaActual(1);

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
    // Paginación - Calcular datos
    // =========================
    const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const ventasPaginadas = ventasFiltradas.slice(indiceInicio, indiceFin);

    // =========================
    // Generar items de paginación
    // =========================
    const generarItemsPaginacion = () => {
        const items = [];
        const maxVisible = 5;

        let startPage = Math.max(1, paginaActual - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPaginas, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            items.push(<Pagination.First key="first" onClick={() => setPaginaActual(1)} disabled={paginaActual === 1} />);
            items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
        }

        for (let numero = startPage; numero <= endPage; numero++) {
            items.push(
                <Pagination.Item key={numero} active={numero === paginaActual} onClick={() => setPaginaActual(numero)}>
                    {numero}
                </Pagination.Item>
            );
        }

        if (endPage < totalPaginas) {
            items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            items.push(<Pagination.Last key="last" onClick={() => setPaginaActual(totalPaginas)} disabled={paginaActual === totalPaginas} />);
        }

        return items;
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
                    ventas={ventasPaginadas}
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
                    ventas={ventasPaginadas}
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

            {/* Paginación */}
            {totalPaginas > 1 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center align-items-center flex-column">
                        <Pagination className="mb-2">
                            <Pagination.Prev
                                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                disabled={paginaActual === 1}
                            />
                            {generarItemsPaginacion()}
                            <Pagination.Next
                                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                disabled={paginaActual === totalPaginas}
                            />
                        </Pagination>
                        <small className="text-muted">
                            Mostrando {indiceInicio + 1} - {Math.min(indiceFin, ventasFiltradas.length)} de {ventasFiltradas.length} ventas
                        </small>
                    </Col>
                </Row>
            )}

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