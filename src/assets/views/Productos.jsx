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

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";

import TablaProductos from "../components/productos/TablaProductos";
import TarjetaProductos from "../components/productos/TarjetasProductos";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Productos = () => {

    // =========================
    // Estados
    // =========================

    const [mostrarModal, setMostrarModal] =
        useState(false);

    const [
        mostrarModalEdicion,
        setMostrarModalEdicion
    ] = useState(false);

    const [
        mostrarModalEliminacion,
        setMostrarModalEliminacion
    ] = useState(false);

    const [productos, setProductos] =
        useState([]);

    const [
        productosFiltrados,
        setProductosFiltrados
    ] = useState([]);

    const [
        textoBusqueda,
        setTextoBusqueda
    ] = useState("");

    const [
        productoSeleccionado,
        setProductoSeleccionado
    ] = useState(null);

    const [cargando, setCargando] =
        useState(false);

    // =========================
    // Toast
    // =========================

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    // =========================
    // Cargar productos
    // =========================

    const cargarProductos = async () => {

        try {

            setCargando(true);

            const {
                data,
                error
            } = await supabase
                .from("productos")
                .select("*")
                .order(
                    "id_producto",
                    {
                        ascending: true
                    }
                );

            if (error) throw error;

            setProductos(data || []);
            setProductosFiltrados(data || []);

        } catch (error) {

            console.log(
                "Error al cargar productos:",
                error
            );

            setToast({
                mostrar: true,
                mensaje:
                    "Error al cargar productos.",
                tipo: "danger"
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // Agregar producto
    // =========================

    const agregarProducto = async (
        nuevoProducto
    ) => {

        try {

            if (
                !nuevoProducto.nombre_producto?.trim()
            ) {

                setToast({
                    mostrar: true,
                    mensaje:
                        "Debe ingresar el nombre del producto.",
                    tipo: "warning"
                });

                return;
            }

            const { error } =
                await supabase
                    .from("productos")
                    .insert([
                        {
                            nombre_producto:
                                nuevoProducto.nombre_producto,

                            categoria_producto:
                                nuevoProducto.categoria_producto,

                            precio:
                                nuevoProducto.precio
                                    ? parseFloat(
                                        nuevoProducto.precio
                                    )
                                    : 0,

                            stock:
                                nuevoProducto.stock
                                    ? parseInt(
                                        nuevoProducto.stock
                                    )
                                    : 0
                        }
                    ]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Producto registrado correctamente.",
                tipo: "success"
            });

            setMostrarModal(false);

            await cargarProductos();

        } catch (error) {

            console.error(
                "Error al registrar producto:",
                error
            );

            setToast({
                mostrar: true,
                mensaje:
                    error.message ||
                    "Error al registrar producto.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Actualizar producto
    // =========================

    const actualizarProducto = async (
        productoActualizado
    ) => {

        try {

            const id = Number(
                productoActualizado.id_producto
            );

            const { error } =
                await supabase
                    .from("productos")
                    .update({

                        nombre_producto:
                            productoActualizado.nombre_producto,

                        categoria_producto:
                            productoActualizado.categoria_producto,

                        precio:
                            parseFloat(
                                productoActualizado.precio
                            ),

                        stock:
                            parseInt(
                                productoActualizado.stock
                            )
                    })
                    .eq(
                        "id_producto",
                        id
                    );

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Producto actualizado correctamente.",
                tipo: "success"
            });

            setMostrarModalEdicion(false);

            await cargarProductos();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al actualizar producto.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Eliminar producto
    // =========================

    const eliminarProducto = async (
        id
    ) => {

        try {

            const { error } =
                await supabase
                    .from("productos")
                    .delete()
                    .eq(
                        "id_producto",
                        id
                    );

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Producto eliminado correctamente.",
                tipo: "success"
            });

            setMostrarModalEliminacion(
                false
            );

            await cargarProductos();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al eliminar producto.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Buscar productos
    // =========================

    const handleBusqueda = (e) => {

        const texto = e.target.value;

        setTextoBusqueda(texto);

        const resultados =
            productos.filter(
                (producto) =>

                    producto.nombre_producto
                        ?.toLowerCase()
                        .includes(
                            texto.toLowerCase()
                        )

                    ||

                    producto.categoria_producto
                        ?.toLowerCase()
                        .includes(
                            texto.toLowerCase()
                        )
            );

        setProductosFiltrados(
            resultados
        );
    };

    // =========================
    // useEffect
    // =========================

    useEffect(() => {

        cargarProductos();

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

                        <i className="bi bi-box-seam-fill me-2"></i>

                        Productos Fitness

                    </h3>

                </Col>

                <Col
                    xs={3}
                    className="text-end"
                >

                    <Button
                        onClick={() =>
                            setMostrarModal(
                                true
                            )
                        }
                    >

                        <i className="bi bi-plus-lg"></i>

                        <span className="ms-2 d-none d-sm-inline">

                            Nuevo Producto

                        </span>

                    </Button>

                </Col>

            </Row>

            <hr />

            {/* BUSCADOR */}
            <CuadroBusquedas
                textoBusqueda={
                    textoBusqueda
                }
                onChange={
                    handleBusqueda
                }
            />

            {/* ALERTA */}
            {
                productosFiltrados.length === 0 && (

                    <Alert variant="danger">

                        No se encontraron productos.

                    </Alert>
                )
            }

            {/* TABLA EN PC */}
            <div className="d-none d-md-block">

                <TablaProductos
                    productos={
                        productosFiltrados
                    }
                    cargando={cargando}

                    onEditar={(producto) => {

                        setProductoSeleccionado(
                            producto
                        );

                        setMostrarModalEdicion(
                            true
                        );
                    }}

                    onEliminar={(producto) => {

                        setProductoSeleccionado(
                            producto
                        );

                        setMostrarModalEliminacion(
                            true
                        );
                    }}
                />

            </div>

            {/* TARJETAS EN CELULAR */}
            <div className="d-block d-md-none">

                <TarjetaProductos
                    productos={
                        productosFiltrados
                    }

                    onEditar={(producto) => {

                        setProductoSeleccionado(
                            producto
                        );

                        setMostrarModalEdicion(
                            true
                        );
                    }}

                    onEliminar={(producto) => {

                        setProductoSeleccionado(
                            producto
                        );

                        setMostrarModalEliminacion(
                            true
                        );
                    }}
                />

            </div>

            {/* Modal Registro */}
            <ModalRegistroProducto
                mostrar={mostrarModal}
                setMostrar={
                    setMostrarModal
                }
                agregarProducto={
                    agregarProducto
                }
            />

            {/* Modal Edición */}
            <ModalEdicionProducto
                mostrar={
                    mostrarModalEdicion
                }
                setMostrar={
                    setMostrarModalEdicion
                }
                producto={
                    productoSeleccionado
                }
                actualizarProducto={
                    actualizarProducto
                }
            />

            {/* Modal Eliminación */}
            <ModalEliminacionProducto
                mostrar={
                    mostrarModalEliminacion
                }
                setMostrar={
                    setMostrarModalEliminacion
                }
                producto={
                    productoSeleccionado
                }
                eliminarProducto={
                    eliminarProducto
                }
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

export default Productos;