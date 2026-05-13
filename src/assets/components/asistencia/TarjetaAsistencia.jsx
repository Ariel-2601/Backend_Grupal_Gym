import React from "react";

import {
  Row,
  Col,
  Card,
  Button
} from "react-bootstrap";

const TarjetaAsistencias = ({
  asistencias,
  onEditar,
  onEliminar,
}) => {

  return (

    <Row className="mb-4">

      {
        asistencias.length === 0 ? (

          <Col xs={12}>

            <Card className="shadow-sm text-center p-4">

              <Card.Body>

                <i
                  className="bi bi-calendar-check"
                  style={{
                    fontSize: "3rem",
                    color: "#ffc107",
                  }}
                ></i>

                <h5 className="mt-3 text-muted">
                  No hay asistencias registradas
                </h5>

              </Card.Body>

            </Card>

          </Col>

        ) : (

          asistencias.map((asistencia) => (

            <Col
              key={asistencia.id_asistencia}
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
                      className="bi bi-calendar2-check-fill"
                      style={{
                        fontSize: "4rem",
                        color: "#ffc107",
                      }}
                    ></i>

                  </div>

                  {/* Cliente */}
                  <Card.Title className="text-center fw-bold">

                    {asistencia.clientes?.nombre_cliente}

                  </Card.Title>

                  <hr />

                  {/* Datos */}
                  <p className="mb-2">

                    <strong>ID:</strong>{" "}
                    {asistencia.id_asistencia}

                  </p>

                  <p className="mb-2">

                    <strong>Fecha:</strong>{" "}
                    {asistencia.fecha}

                  </p>

                  <p className="mb-2">

                    <strong>Hora:</strong>{" "}
                    {asistencia.hora}

                  </p>

                  <p className="mb-3">

                    <strong>Estado:</strong>{" "}
                    {asistencia.estado}

                  </p>

                  {/* Botones */}
                  <div className="d-flex justify-content-center gap-2">

                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        onEditar(asistencia)
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        onEliminar(asistencia)
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

export default TarjetaAsistencias;