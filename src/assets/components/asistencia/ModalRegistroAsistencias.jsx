/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroAsistencias = ({
  show,
  handleClose,
  registrarAsistencia,
}) => {
  const [cliente, setCliente] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    registrarAsistencia({
      cliente,
      fecha,
      horaEntrada,
    });

    limpiarFormulario();
    handleClose();
  };

  const limpiarFormulario = () => {
    setCliente("");
    setFecha("");
    setHoraEntrada("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Asistencia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>

            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>

            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de Entrada</Form.Label>

            <Form.Control
              type="time"
              value={horaEntrada}
              onChange={(e) => setHoraEntrada(e.target.value)}
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

export default ModalRegistroAsistencias;
