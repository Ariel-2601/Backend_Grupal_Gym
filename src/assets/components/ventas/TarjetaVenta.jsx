import React from "react";

import {
  Row,
  Col,
  Card,
  Button
} from "react-bootstrap";

const TarjetaVentas = ({
  ventas,
  onEditar,
  onEliminar
}) => {

  return (

    <Row className="mb-4">

      {
        ventas.length === 0 ? (

          <Col xs={12}>

            <Card className="shadow-sm text-center p-4">

              <Card.Body>

                <i
                  className="bi bi-cart-x"
                  style={{
                    fontSize: "3rem",
                    color: "#dc3545"
                  }}
                ></i>

                <h5 className="mt-3 text-muted">
                  No hay ventas registradas
                </h5>

              </Card.Body>

            </Card>

          </Col>

        ) : (

          ventas.map((venta) => (

            <Col
              key={venta.id_venta}
              xs={12}
              sm={6}
              className="mb-3"
            >

              <Card className="h-100 shadow-sm border-0">

                <Card.Body>

                  {/* Icono */}
                  <div className="text-center mb-3">

                    <i
                      className="bi bi-cart-fill"
                      style={{
                        fontSize: "4rem",
                        color: "#0d6efd"
                      }}
                    ></i>

                  </div>

                  {/* Cliente */}
                  <Card.Title className="text-center fw-bold">

                    {
                      venta.clientes
                        ? `${venta.clientes.nombres} ${venta.clientes.apellidos}`
                        : "Cliente no disponible"
                    }

                  </Card.Title>

                  <hr />

                  {/* Datos */}
                  <p className="mb-2">
                    <strong>ID:</strong>{" "}
                    {venta.id_venta}
                  </p>

                  {/* PRODUCTOS */}
                  <p className="mb-2">
                    <strong>Productos:</strong>
                  </p>

                  {
                    venta.detalle_ventas?.length > 0
                      ? venta.detalle_ventas.map(
                        (detalle, index) => (

                          <p
                            key={index}
                            className="mb-1"
                          >
                            • {
                              detalle.productos?.nombre_producto
                            }

                            {" "}
                            (x{detalle.cantidad})
                          </p>
                        )
                      )
                      : (
                        <p>Sin productos</p>
                      )
                  }

                  <p className="mb-2 mt-3">
                    <strong>Total:</strong>{" "}
                    C$ {venta.total}
                  </p>

                  <p className="mb-2">
                    <strong>Método Pago:</strong>{" "}
                    {venta.metodo_pago}
                  </p>

                  <p className="mb-3">
                    <strong>Fecha:</strong>{" "}
                    {venta.fecha_venta}
                  </p>

                  {/* Botones */}
                  <div className="d-flex justify-content-center gap-2">

                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() =>
                        onEditar(venta)
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        onEliminar(venta)
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

export default TarjetaVentas;