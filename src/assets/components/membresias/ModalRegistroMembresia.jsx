/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroMembresia = ({
  show,
  handleClose,
  registrarMembresia,
}) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    registrarMembresia({
      nombre,
      precio,
      duracion,
    });

    limpiarFormulario();
    handleClose();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setDuracion("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Membresía</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Membresía</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>

            <Form.Control
              type="number"
              placeholder="Ingrese el precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ejemplo: 1 mes"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
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

export default ModalRegistroMembresia;