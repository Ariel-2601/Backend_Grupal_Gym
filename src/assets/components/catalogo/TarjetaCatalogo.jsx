import React from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

const TarjetaCatalogo = ({
    productos,
    onVerProducto,
}) => {
    return (
        <Row className="mb-4">

            {productos.length === 0 ? (
                <Col xs={12}>
                    <Card className="shadow-sm text-center p-4">
                        <Card.Body>
                            <i
                                className="bi bi-box-seam"
                                style={{
                                    fontSize: "3rem",
                                    color: "#198754",
                                }}
                            ></i>

                            <h5 className="mt-3 text-muted">
                                No hay productos disponibles
                            </h5>
                        </Card.Body>
                    </Card>
                </Col>
            ) : (
                productos.map((producto) => (
                    <Col
                        key={producto.id_producto}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-4"
                    >
                        <Card
                            className="h-100 shadow-sm border-0"
                            onClick={() => onVerProducto(producto)}
                            style={{
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >

                            {/* Imagen */}
                            <div
                                className="d-flex justify-content-center align-items-center p-3"
                                style={{
                                    height: "220px",
                                    backgroundColor: "#f8f9fa",
                                }}
                            >
                                <img
                                    src={
                                        producto.imagen ||
                                        "https://via.placeholder.com/300"
                                    }
                                    alt={producto.nombre_producto}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>

                            <Card.Body>

                                {/* Categoría */}
                                <div className="text-center mb-2">
                                    <Badge bg="dark">
                                        {producto.categoria_producto}
                                    </Badge>
                                </div>

                                {/* Nombre */}
                                <Card.Title className="text-center fw-bold">
                                    {producto.nombre_producto}
                                </Card.Title>

                                <hr />

                                {/* Precio */}
                                <h4 className="text-success text-center">
                                    ${producto.precio}
                                </h4>

                                {/* Stock */}
                                <p className="text-center mb-3">
                                    <strong>Stock:</strong>{" "}
                                    {producto.stock}
                                </p>

                                {/* Botón */}
                                <div className="d-grid">
                                    <Button variant="primary">
                                        <i className="bi bi-eye-fill me-2"></i>
                                        Ver Producto
                                    </Button>
                                </div>

                            </Card.Body>

                        </Card>
                    </Col>
                ))
            )}

        </Row>
    );
};

export default TarjetaCatalogo;