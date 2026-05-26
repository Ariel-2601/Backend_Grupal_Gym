import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Badge
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Catalogo = () => {

    // =========================
    // ESTADOS
    // =========================

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // =========================
    // OBTENER PRODUCTOS
    // =========================

    const obtenerProductos = async () => {

        setCargando(true);

        const { data, error } = await supabase
            .from("productos")
            .select("*");

        if (error) {
            console.log(error);
        } else {
            setProductos(data);
        }

        setCargando(false);
    };

    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {
        obtenerProductos();
    }, []);

    // =========================
    // LOADING
    // =========================

    if (cargando) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    // =========================
    // RENDER
    // =========================

    return (
        <Container className="py-4">

            <h1 className="text-center mb-5">
                Catálogo de Productos
            </h1>

            <Row>

                {productos.map((producto) => (

                    <Col
                        key={producto.id_producto}
                        md={6}
                        lg={4}
                        xl={3}
                        className="mb-4"
                    >

                        <Card className="h-100 shadow border-0">

                            <Card.Img
                                variant="top"
                                src={
                                    producto.imagen ||
                                    "https://via.placeholder.com/300x250"
                                }
                                style={{
                                    height: "250px",
                                    objectFit: "cover"
                                }}
                            />

                            <Card.Body>

                                <Badge
                                    bg="dark"
                                    className="mb-2"
                                >
                                    {producto.categoria_producto}
                                </Badge>

                                <Card.Title>
                                    {producto.nombre_producto}
                                </Card.Title>

                                <h4 className="text-success">
                                    ${producto.precio}
                                </h4>

                                <p>
                                    Stock disponible:
                                    {" "}
                                    <strong>
                                        {producto.stock}
                                    </strong>
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