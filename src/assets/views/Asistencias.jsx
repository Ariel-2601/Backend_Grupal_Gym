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

import ModalRegistroAsistencia from "../components/asistencia/ModalRegistroAsistencias";
import ModalEdicionAsistencia from "../components/asistencia/ModalEdicionAsistencias";
import ModalEliminacionAsistencia from "../components/asistencia/ModalEliminacionAsistencia";

import TablaAsistencias from "../components/asistencia/TablaAsistencia";
import TarjetaAsistencias from "../components/asistencia/TarjetaAsistencia";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Asistencias = () => {

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

    const [asistencias, setAsistencias] =
        useState([]);

    const [
        asistenciasFiltradas,
        setAsistenciasFiltradas
    ] = useState([]);

    const [
        textoBusqueda,
        setTextoBusqueda
    ] = useState("");

    const [
        asistenciaSeleccionada,
        setAsistenciaSeleccionada
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
    // Cargar asistencias
    // =========================

    const cargarAsistencias = async () => {

        try {

            setCargando(true);

            const {
                data,
                error
            } = await supabase
                .from("asistencias")
                .select(`
                    *,
                    clientes (
                        nombres,
                        apellidos
                    )
                `)
                .order(
                    "id_asistencia",
                    {
                        ascending: true
                    }
                );

            if (error) throw error;

            setAsistencias(data || []);

            setAsistenciasFiltradas(
                data || []
            );

        } catch (error) {

            console.log(
                "Error al cargar asistencias:",
                error
            );

            setToast({
                mostrar: true,
                mensaje:
                    "Error al cargar asistencias.",
                tipo: "danger"
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // Registrar asistencia
    // =========================

    const agregarAsistencia = async (
        nuevaAsistencia
    ) => {

        try {

            const asistenciaData = {

                id_cliente:
                    Number(
                        nuevaAsistencia.id_cliente
                    ) || 1,

                fecha:
                    nuevaAsistencia.fecha ||
                    new Date()
                        .toISOString()
                        .split("T")[0],

                hora_entrada:
                    nuevaAsistencia.hora_entrada ||
                    "08:00",

                hora_salida:
                    nuevaAsistencia.hora_salida ||
                    "10:00",

                observacion:
                    nuevaAsistencia.observacion ||
                    "Sin observación"
            };

            const { error } =
                await supabase
                    .from("asistencias")
                    .insert([
                        asistenciaData
                    ]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Asistencia registrada correctamente.",
                tipo: "success"
            });

            setMostrarModal(false);

            await cargarAsistencias();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al registrar asistencia.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Actualizar asistencia
    // =========================

    const actualizarAsistencia =
        async (
            asistenciaActualizada
        ) => {

            try {

                const { error } =
                    await supabase
                        .from("asistencias")
                        .update({

                            id_cliente:
                                asistenciaActualizada.id_cliente,

                            fecha:
                                asistenciaActualizada.fecha,

                            hora_entrada:
                                asistenciaActualizada.hora_entrada,

                            hora_salida:
                                asistenciaActualizada.hora_salida,

                            observacion:
                                asistenciaActualizada.observacion
                        })
                        .eq(
                            "id_asistencia",
                            asistenciaActualizada.id_asistencia
                        );

                if (error) throw error;

                setToast({
                    mostrar: true,
                    mensaje:
                        "Asistencia actualizada correctamente.",
                    tipo: "success"
                });

                setMostrarModalEdicion(false);

                await cargarAsistencias();

            } catch (error) {

                console.log(error);

                setToast({
                    mostrar: true,
                    mensaje:
                        "Error al actualizar asistencia.",
                    tipo: "danger"
                });
            }
        };

    // =========================
    // Eliminar asistencia
    // =========================

    const eliminarAsistencia =
        async (id) => {

            try {

                const { error } =
                    await supabase
                        .from("asistencias")
                        .delete()
                        .eq(
                            "id_asistencia",
                            id
                        );

                if (error) throw error;

                setToast({
                    mostrar: true,
                    mensaje:
                        "Asistencia eliminada correctamente.",
                    tipo: "success"
                });

                setMostrarModalEliminacion(
                    false
                );

                await cargarAsistencias();

            } catch (error) {

                console.log(error);

                setToast({
                    mostrar: true,
                    mensaje:
                        "Error al eliminar asistencia.",
                    tipo: "danger"
                });
            }
        };

    // =========================
    // Buscar asistencias
    // =========================

    const handleBusqueda = (e) => {

        const texto = e.target.value;

        setTextoBusqueda(texto);

        const resultados =
            asistencias.filter(
                (asistencia) =>

                    asistencia.clientes?.nombres
                        ?.toLowerCase()
                        .includes(
                            texto.toLowerCase()
                        ) ||

                    asistencia.clientes?.apellidos
                        ?.toLowerCase()
                        .includes(
                            texto.toLowerCase()
                        ) ||

                    asistencia.observacion
                        ?.toLowerCase()
                        .includes(
                            texto.toLowerCase()
                        )
            );

        setAsistenciasFiltradas(
            resultados
        );
    };

    // =========================
    // useEffect
    // =========================

    useEffect(() => {

        cargarAsistencias();

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

                        <i className="bi bi-calendar-check-fill me-2"></i>

                        Asistencias

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

                            Nueva Asistencia

                        </span>

                    </Button>

                </Col>

            </Row>

            <hr />

            {/* BUSCADOR */}

            <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                onChange={handleBusqueda}
            />

            {
                asistenciasFiltradas.length === 0 && (

                    <Alert variant="danger">

                        No se encontraron asistencias.

                    </Alert>
                )
            }

            {/* TABLA EN PC */}
            <div className="d-none d-md-block">

                <TablaAsistencias
                    asistencias={
                        asistenciasFiltradas
                    }
                    cargando={cargando}
                    recargar={
                        cargarAsistencias
                    }

                    onEditar={(
                        asistencia
                    ) => {

                        setAsistenciaSeleccionada(
                            asistencia
                        );

                        setMostrarModalEdicion(
                            true
                        );
                    }}

                    onEliminar={(
                        asistencia
                    ) => {

                        setAsistenciaSeleccionada(
                            asistencia
                        );

                        setMostrarModalEliminacion(
                            true
                        );
                    }}
                />

            </div>

            {/* TARJETAS EN CELULAR */}
            <div className="d-block d-md-none">

                <TarjetaAsistencias
                    asistencias={
                        asistenciasFiltradas
                    }

                    onEditar={(
                        asistencia
                    ) => {

                        setAsistenciaSeleccionada(
                            asistencia
                        );

                        setMostrarModalEdicion(
                            true
                        );
                    }}

                    onEliminar={(
                        asistencia
                    ) => {

                        setAsistenciaSeleccionada(
                            asistencia
                        );

                        setMostrarModalEliminacion(
                            true
                        );
                    }}
                />

            </div>

            {/* Modal Registro */}
            <ModalRegistroAsistencia
                mostrar={mostrarModal}
                setMostrar={
                    setMostrarModal
                }
                agregarAsistencia={
                    agregarAsistencia
                }
            />

            {/* Modal Edición */}
            <ModalEdicionAsistencia
                mostrar={
                    mostrarModalEdicion
                }
                setMostrar={
                    setMostrarModalEdicion
                }
                asistencia={
                    asistenciaSeleccionada
                }
                actualizarAsistencia={
                    actualizarAsistencia
                }
            />

            {/* Modal Eliminación */}
            <ModalEliminacionAsistencia
                mostrar={
                    mostrarModalEliminacion
                }
                setMostrar={
                    setMostrarModalEliminacion
                }
                asistencia={
                    asistenciaSeleccionada
                }
                eliminarAsistencia={
                    eliminarAsistencia
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

export default Asistencias;