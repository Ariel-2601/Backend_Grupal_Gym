import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const TarjetaProductos = ({
  productos,
  onEditar,
  onEliminar,
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
                No hay productos registrados
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
            className="mb-3"
          >

            <Card className="h-100 shadow-sm border-0">

              <Card.Body>

                {/* Icono */}
                <div className="text-center mb-3">

                  <i
                    className="bi bi-bag-fill"
                    style={{
                      fontSize: "4rem",
                      color: "#0d6efd",
                    }}
                  ></i>

                </div>

                {/* Nombre */}
                <Card.Title className="text-center fw-bold">
                  {producto.nombre_producto}
                </Card.Title>

                <hr />

                {/* Datos */}
                <p className="mb-2">
                  <strong>ID:</strong> {producto.id_producto}
                </p>

                <p className="mb-2">
                  <strong>Categoría:</strong>{" "}
                  {producto.categoria_producto}
                </p>

                <p className="mb-2">
                  <strong>Precio:</strong> C$ {producto.precio}
                </p>

                <p className="mb-3">
                  <strong>Stock:</strong> {producto.stock}
                </p>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-2">

                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onEditar(producto)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onEliminar(producto)}
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

export default TarjetaProductos;