import React from "react";

import {
    Row,
    Col,
    Card,
    Button,
    Badge
} from "react-bootstrap";

const TarjetaMembresias = ({
    membresias,
    onEditar,
    onEliminar,
}) => {

    return (

        <Row className="mb-4">

            {
                membresias.length === 0 ? (

                    <Col xs={12}>

                        <Card className="shadow-sm text-center p-4">

                            <Card.Body>

                                <i
                                    className="bi bi-credit-card"
                                    style={{
                                        fontSize: "3rem",
                                        color: "#0d6efd",
                                    }}
                                ></i>

                                <h5 className="mt-3 text-muted">
                                    No hay membresías registradas
                                </h5>

                            </Card.Body>

                        </Card>

                    </Col>

                ) : (

                    membresias.map((membresia) => (

                        <Col
                            key={membresia.id_membresia}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="mb-3"
                        >

                            <Card className="h-100 shadow-sm border-0">

                                <Card.Body>

                                    {/* Icono */}
                                    <div className="text-center mb-3">

                                        <i
                                            className="bi bi-credit-card-2-front-fill"
                                            style={{
                                                fontSize: "4rem",
                                                color: "#0d6efd",
                                            }}
                                        ></i>

                                    </div>

                                    {/* Nombre */}
                                    <Card.Title className="text-center fw-bold">

                                        {membresia.nombre}

                                    </Card.Title>

                                    <div className="text-center mb-3">

                                        <Badge
                                            bg={
                                                membresia.estado === "Activa"
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {membresia.estado}
                                        </Badge>

                                    </div>

                                    <hr />

                                    {/* Datos */}
                                    <p className="mb-2">

                                        <strong>ID:</strong>{" "}
                                        {membresia.id_membresia}

                                    </p>

                                    <p className="mb-2">

                                        <strong>Descripción:</strong>{" "}
                                        {membresia.descripcion}

                                    </p>

                                    <p className="mb-2">

                                        <strong>Precio:</strong>{" "}
                                        C$ {membresia.precio}

                                    </p>

                                    <p className="mb-3">

                                        <strong>Duración:</strong>{" "}
                                        {membresia.duracion_dias} días

                                    </p>

                                    {/* Botones */}
                                    <div className="d-flex justify-content-center gap-2">

                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() =>
                                                onEditar(membresia)
                                            }
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                onEliminar(membresia)
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>

                                    </div>

                                </Card.Body>

                            </Card>

                        </Col>

                    ))

                )
            }

        </Row>
    );
};

export default TarjetaMembresias;