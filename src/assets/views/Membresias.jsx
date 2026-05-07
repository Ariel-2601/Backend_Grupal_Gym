/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Button
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import ModalRegistroMembresia from "../components/membresias/ModalRegistroMembresia";
import ModalEdicionMembresia from "../components/membresias/ModalEdicionMembresia";
import ModalEliminacionMembresia from "../components/membresias/ModalEliminacionMembresia";

import TablaMembresias from "../components/membresias/TablaMembresia";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Membresias = () => {

    // =========================
    // Estados
    // =========================

    const [mostrarModal, setMostrarModal] = useState(false);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

    const [membresias, setMembresias] = useState([]);

    const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);

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
    // Cargar membresías
    // =========================

    const cargarMembresias = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("membresias")
                .select("*")
                .order("id_membresia", {
                    ascending: true
                });

            if (error) throw error;

            setMembresias(data || []);

        } catch (error) {

            console.log(
                "Error al cargar membresías:",
                error
            );

            setToast({
                mostrar: true,
                mensaje: "Error al cargar membresías.",
                tipo: "danger"
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // Agregar membresía
    // =========================

    const agregarMembresia = async (nuevaMembresia) => {

        try {

            if (!nuevaMembresia.nombre.trim()) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe ingresar un nombre.",
                    tipo: "warning"
                });

                return;
            }

            const { error } = await supabase
                .from("membresias")
                .insert([
                    {
                        nombre: nuevaMembresia.nombre,

                        descripcion:
                            nuevaMembresia.descripcion,

                        precio:
                            nuevaMembresia.precio,

                        duracion_dias:
                            nuevaMembresia.duracion_dias,

                        estado:
                            nuevaMembresia.estado
                    }
                ]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Membresía registrada correctamente.",
                tipo: "success"
            });

            setMostrarModal(false);

            await cargarMembresias();

        } catch (error) {

            console.log("Error al registrar:", error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al registrar membresía.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Actualizar membresía
    // =========================

    const actualizarMembresia = async (
        membresiaActualizada
    ) => {

        try {

            const { error } = await supabase
                .from("membresias")
                .update({
                    nombre:
                        membresiaActualizada.nombre,

                    descripcion:
                        membresiaActualizada.descripcion,

                    precio:
                        membresiaActualizada.precio,

                    duracion_dias:
                        membresiaActualizada.duracion_dias,

                    estado:
                        membresiaActualizada.estado
                })
                .eq(
                    "id_membresia",
                    membresiaActualizada.id_membresia
                );

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Membresía actualizada correctamente.",
                tipo: "success"
            });

            setMostrarModalEdicion(false);

            await cargarMembresias();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al actualizar membresía.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // Eliminar membresía
    // =========================

    const eliminarMembresia = async (id) => {

        try {

            const { error } = await supabase
                .from("membresias")
                .delete()
                .eq("id_membresia", id);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje:
                    "Membresía eliminada correctamente.",
                tipo: "success"
            });

            setMostrarModalEliminacion(false);

            await cargarMembresias();

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al eliminar membresía.",
                tipo: "danger"
            });
        }
    };

    // =========================
    // useEffect
    // =========================

    useEffect(() => {
        cargarMembresias();
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
                        <i className="bi bi-credit-card-2-front-fill me-2"></i>
                        Membresías
                    </h3>

                </Col>

                <Col xs={3} className="text-end">

                    <Button
                        onClick={() =>
                            setMostrarModal(true)
                        }
                    >
                        <i className="bi bi-plus-lg"></i>

                        <span className="ms-2 d-none d-sm-inline">
                            Nueva Membresía
                        </span>
                    </Button>

                </Col>

            </Row>

            <hr />

            {/* Tabla */}
            <TablaMembresias
                membresias={membresias}
                cargando={cargando}
                recargar={cargarMembresias}

                onEditar={(membresia) => {
                    setMembresiaSeleccionada(
                        membresia
                    );

                    setMostrarModalEdicion(true);
                }}

                onEliminar={(membresia) => {
                    setMembresiaSeleccionada(
                        membresia
                    );

                    setMostrarModalEliminacion(true);
                }}
            />

            {/* Modal Registro */}
            <ModalRegistroMembresia
                mostrar={mostrarModal}
                setMostrar={setMostrarModal}
                agregarMembresia={agregarMembresia}
            />

            {/* Modal Edición */}
            <ModalEdicionMembresia
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                membresia={membresiaSeleccionada}
                actualizarMembresia={
                    actualizarMembresia
                }
            />

            {/* Modal Eliminación */}
            <ModalEliminacionMembresia
                mostrar={mostrarModalEliminacion}
                setMostrar={
                    setMostrarModalEliminacion
                }
                membresia={membresiaSeleccionada}
                eliminarMembresia={
                    eliminarMembresia
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

export default Membresias;