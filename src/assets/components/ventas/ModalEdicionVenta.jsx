/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionVenta = ({
  show,
  handleClose,
 venta,
  actualizarVenta,
}) => {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    if (venta) {
      setCliente(venta.cliente || "");
      setProducto(venta.producto || "");
      setCantidad(venta.cantidad || "");
      setTotal(venta.total || "");
    }
  }, [venta]);

  const handleSubmit = (e) => {
    e.preventDefault();

    actualizarVenta({
      ...venta,
      cliente,
      producto,
      cantidad,
      total,
    });

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Venta</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>

            <Form.Control
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>

            <Form.Control
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>

            <Form.Control
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total</Form.Label>

            <Form.Control
              type="number"
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

          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionVenta;