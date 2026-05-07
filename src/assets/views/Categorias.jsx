/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Categorias = () => {

    // Estados
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Toast
    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    // Cargar categorías
    const cargarCategorias = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("categorias")
                .select("*")
                .order("id_categoria", { ascending: true });

            if (error) {
                console.log(error);
                throw error;
            }

            setCategorias(data || []);

        } catch (error) {

            console.log("Error al cargar categorías:", error);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar categorías.",
                tipo: "danger"
            });

        } finally {

            setCargando(false);
        }
    };

    // Agregar categoría
    const agregarCategoria = async (nuevaCategoria) => {

        try {

            // Validar nombre
            if (!nuevaCategoria.nombre_categoria.trim()) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe ingresar un nombre.",
                    tipo: "warning"
                });

                return;
            }

            const { error } = await supabase
                .from("categorias")
                .insert([
                    {
                        nombre_categoria: nuevaCategoria.nombre_categoria,
                        descripcion_categoria: nuevaCategoria.descripcion_categoria
                    }
                ]);

            if (error) {
                console.log(error);
                throw error;
            }

            // Toast éxito
            setToast({
                mostrar: true,
                mensaje: "Categoría registrada correctamente.",
                tipo: "success"
            });

            // Cerrar modal
            setMostrarModal(false);

            // Recargar tabla
            await cargarCategorias();

        } catch (error) {

            console.log("Error al registrar:", error);

            setToast({
                mostrar: true,
                mensaje: "Error al registrar categoría.",
                tipo: "danger"
            });
        }
    };

    // Ejecutar al iniciar
    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <Container className="mt-3">

            {/* Encabezado */}
            <Row className="align-items-center mb-3">

                <Col xs={9}>
                    <h3 className="mb-0">
                        <i className="bi bi-bookmark-plus-fill me-2"></i>
                        Categorías
                    </h3>
                </Col>

                <Col xs={3} className="text-end">

                    <Button onClick={() => setMostrarModal(true)}>
                        <i className="bi bi-plus-lg"></i>

                        <span className="ms-2 d-none d-sm-inline">
                            Nueva Categoría
                        </span>
                    </Button>

                </Col>

            </Row>

            <hr />

            {/* Tabla */}
            <TablaCategorias
                categorias={categorias}
                cargando={cargando}
                recargar={cargarCategorias}
            />

            {/* Modal */}
            <ModalRegistroCategoria
                mostrar={mostrarModal}
                setMostrar={setMostrarModal}
                agregarCategoria={agregarCategoria}
            />

            {/* Notificación */}
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

export default Categorias;