import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Badge,
    Modal,
    Button
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Catalogo = () => {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

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

    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModal(true);
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    if (cargando) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

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

                        <Card
                            className="h-100 shadow border-0"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s"
                            }}
                            onClick={() => verProducto(producto)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >

                            <Card.Img
                                variant="top"
                                src={
                                    producto.imagen ||
                                    "https://via.placeholder.com/300x250"
                                }
                                style={{
                                    height: "250px",
                                    objectFit: "contain",
                                    backgroundColor: "#f8f9fa",
                                    padding: "10px"
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
                                    Stock disponible:{" "}
                                    <strong>
                                        {producto.stock}
                                    </strong>
                                </p>

                            </Card.Body>

                        </Card>

                    </Col>

                ))}

            </Row>

            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                size="xl"
                centered
            >
                {productoSeleccionado && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {productoSeleccionado.nombre_producto}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>

                            <img
                                src={
                                    productoSeleccionado.imagen ||
                                    "https://via.placeholder.com/600x400"
                                }
                                alt={productoSeleccionado.nombre_producto}
                                className="img-fluid rounded mb-3"
                                style={{
                                    width: "100%",
                                    height: "600px",
                                    objectFit: "contain",
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px"
                                }}
                            />

                            <Badge
                                bg="dark"
                                className="mb-3"
                            >
                                {productoSeleccionado.categoria_producto}
                            </Badge>

                            <h2 className="text-success">
                                ${productoSeleccionado.precio}
                            </h2>

                            <hr />

                            <p>
                                <strong>Stock disponible:</strong>{" "}
                                {productoSeleccionado.stock}
                            </p>

                            <p>
                                <strong>Categoría:</strong>{" "}
                                {productoSeleccionado.categoria_producto}
                            </p>

                        </Modal.Body>

                        <Modal.Footer>

                            <Button
                                variant="secondary"
                                onClick={() => setMostrarModal(false)}
                            >
                                Cerrar
                            </Button>

                        </Modal.Footer>
                    </>
                )}
            </Modal>

        </Container>
    );
};

export default Catalogo;