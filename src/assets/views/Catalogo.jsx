import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Spinner
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Catalogo = () => {

    // =========================
    // Estados
    // =========================

    const [productos, setProductos] = useState([]);

    const [cargando, setCargando] = useState(false);

    // =========================
    // Cargar productos
    // =========================

    const cargarProductos = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("productos")
                .select("*")
                .eq("estado", "Activo")
                .order("id_producto", {
                    ascending: true
                });

            if (error) throw error;

            setProductos(data || []);

        } catch (error) {

            console.log(
                "Error al cargar catálogo:",
                error
            );

        } finally {

            setCargando(false);
        }
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

        <Container className="mt-4">

            {/* Encabezado */}
            <Row className="mb-4">

                <Col>

                    <h2>
                        <i className="bi bi-bag-heart-fill me-2"></i>
                        Catálogo Fitness
                    </h2>

                    <p className="text-muted">
                        Productos disponibles en GymLiveFitness
                    </p>

                </Col>

            </Row>

            {/* Loading */}
            {cargando && (

                <div className="text-center py-5">

                    <Spinner animation="border" />

                    <p className="mt-3">
                        Cargando productos...
                    </p>

                </div>
            )}

            {/* Productos */}
            <Row>

                {!cargando && productos.length === 0 && (

                    <Col>

                        <div className="text-center py-5">

                            <h5>
                                No hay productos disponibles
                            </h5>

                        </div>

                    </Col>
                )}

                {productos.map((producto) => (

                    <Col
                        key={producto.id_producto}
                        lg={4}
                        md={6}
                        sm={12}
                        className="mb-4"
                    >

                        <Card className="shadow border-0 h-100">

                            {/* Imagen */}
                            <div
                                className="d-flex align-items-center justify-content-center bg-light"
                                style={{
                                    height: "220px"
                                }}
                            >

                                <i
                                    className="bi bi-box-seam-fill text-secondary"
                                    style={{
                                        fontSize: "5rem"
                                    }}
                                ></i>

                            </div>

                            <Card.Body>

                                {/* Nombre */}
                                <Card.Title>
                                    {producto.nombre_producto}
                                </Card.Title>

                                {/* Categoría */}
                                <Badge bg="dark" className="mb-2">

                                    {
                                        producto.categoria_producto
                                    }

                                </Badge>

                                {/* Descripción */}
                                <Card.Text
                                    className="text-muted"
                                >
                                    {
                                        producto.descripcion
                                    }
                                </Card.Text>

                                {/* Precio */}
                                <h4 className="mt-3 text-success">

                                    C$ {producto.precio}

                                </h4>

                                {/* Stock */}
                                <p className="mt-2">

                                    <strong>
                                        Stock:
                                    </strong>

                                    {" "}

                                    {producto.stock}

                                </p>

                            </Card.Body>

                        </Card>

                    </Col>
                ))}

            </Row>

        </Container>
    );
};

export default Catalogo;