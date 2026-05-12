/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect
} from "react";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

const ModalEdicionVenta = ({
  mostrar,
  setMostrar,
  venta,
  actualizarVenta
}) => {

  const [ventaEditada, setVentaEditada] = useState({
    id_cliente: "",
    total: "",
    metodo_pago: "",
    fecha_venta: ""
  });

  useEffect(() => {

    if (venta) {

      setVentaEditada({
        ...venta
      });

    }

  }, [venta]);

  const handleChange = (e) => {

    setVentaEditada({
      ...ventaEditada,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await actualizarVenta(ventaEditada);

  };

  return (

    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >

      <Form onSubmit={handleSubmit}>

        <Modal.Header closeButton>

          <Modal.Title>
            Editar Venta
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Form.Group className="mb-3">

            <Form.Label>
              ID Cliente
            </Form.Label>

            <Form.Control
              type="number"
              name="id_cliente"
              value={ventaEditada.id_cliente || ""}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Total
            </Form.Label>

            <Form.Control
              type="number"
              name="total"
              value={ventaEditada.total || ""}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Método Pago
            </Form.Label>

            <Form.Control
              type="text"
              name="metodo_pago"
              value={ventaEditada.metodo_pago || ""}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Fecha
            </Form.Label>

            <Form.Control
              type="date"
              name="fecha_venta"
              value={ventaEditada.fecha_venta || ""}
              onChange={handleChange}
            />

          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setMostrar(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
          >
            Guardar Cambios
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  );
};

export default ModalEdicionVenta;