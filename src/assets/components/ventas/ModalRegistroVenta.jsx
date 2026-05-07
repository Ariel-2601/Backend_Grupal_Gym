/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroVenta = ({
  show,
  handleClose,
  registrarVenta,
}) => {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    registrarVenta({
      cliente,
      producto,
      cantidad,
      total,
    });

    limpiarFormulario();
    handleClose();
  };

  const limpiarFormulario = () => {
    setCliente("");
    setProducto("");
    setCantidad("");
    setTotal("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Venta</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingrese el cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingrese el producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>

            <Form.Control
              type="number"
              placeholder="Ingrese la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total</Form.Label>

            <Form.Control
              type="number"
              placeholder="Ingrese el total"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button variant="success" type="submit">
            Registrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroVenta;