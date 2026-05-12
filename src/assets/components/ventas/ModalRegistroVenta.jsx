/* eslint-disable react/prop-types */

import React, { useState } from "react";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

const ModalRegistroVenta = ({
  mostrar,
  setMostrar,
  agregarVenta
}) => {

  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: "",
    total: "",
    metodo_pago: "",
    fecha_venta: ""
  });

  const handleChange = (e) => {

    setNuevaVenta({
      ...nuevaVenta,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await agregarVenta(nuevaVenta);

    setNuevaVenta({
      id_cliente: "",
      total: "",
      metodo_pago: "",
      fecha_venta: ""
    });

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
            Registrar Venta
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
              value={nuevaVenta.id_cliente}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Total
            </Form.Label>

            <Form.Control
              type="number"
              name="total"
              value={nuevaVenta.total}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Método de Pago
            </Form.Label>

            <Form.Control
              type="text"
              name="metodo_pago"
              value={nuevaVenta.metodo_pago}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Fecha
            </Form.Label>

            <Form.Control
              type="date"
              name="fecha_venta"
              value={nuevaVenta.fecha_venta}
              onChange={handleChange}
              required
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
            variant="success"
            type="submit"
          >
            Registrar
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  );
};

export default ModalRegistroVenta;