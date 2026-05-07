/* eslint-disable react/prop-types */

import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionAsistencias = ({
  show,
  handleClose,
  asistencia,
  eliminarAsistencia,
}) => {
  const handleEliminar = () => {
    eliminarAsistencia(asistencia.id);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Asistencia</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro de eliminar la asistencia de{" "}
        <strong>{asistencia?.cliente}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="danger" onClick={handleEliminar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionAsistencias;