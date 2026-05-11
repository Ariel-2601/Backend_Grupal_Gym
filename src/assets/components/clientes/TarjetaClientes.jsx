import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const TarjetaClientes = ({
  clientes,
  onEditar,
  onEliminar,
}) => {
  return (
    <Row className="mb-4">
      {clientes.length === 0 ? (
        <Col xs={12}>
          <Card className="shadow-sm text-center p-4">
            <Card.Body>
              <i
                className="bi bi-people-fill"
                style={{
                  fontSize: "3rem",
                  color: "#198754",
                }}
              ></i>

              <h5 className="mt-3 text-muted">
                No hay clientes registrados
              </h5>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        clientes.map((cliente) => (
          <Col
            key={cliente.id_cliente}
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
                    className="bi bi-person-circle"
                    style={{
                      fontSize: "4rem",
                      color: "#0d6efd",
                    }}
                  ></i>
                </div>

                {/* Nombre */}
                <Card.Title className="text-center fw-bold">
                  {cliente.nombres} {cliente.apellidos}
                </Card.Title>

                <hr />

                {/* Datos */}
                <p className="mb-2">
                  <strong>ID:</strong> {cliente.id_cliente}
                </p>

                <p className="mb-2">
                  <strong>Edad:</strong> {cliente.edad}
                </p>

                <p className="mb-2">
                  <strong>Teléfono:</strong> {cliente.telefono}
                </p>

                <p className="mb-2">
                  <strong>Correo:</strong> {cliente.correo}
                </p>

                <p className="mb-3">
                  <strong>Estado:</strong>{" "}
                  <span
                    className={
                      cliente.estado === "Activo"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {cliente.estado}
                  </span>
                </p>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-2">

                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onEditar(cliente)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onEliminar(cliente)}
                  >
                    <i className="bi bi-trash"></i>
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

export default TarjetaClientes;