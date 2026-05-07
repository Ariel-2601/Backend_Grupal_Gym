/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionMembresia = ({
  show,
  handleClose,
  membresia,
  eliminarMembresia,
}) => {
  const handleEliminar = () => {
    eliminarMembresia(membresia.id);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Membresía</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro de eliminar la membresía{" "}
        <strong>{membresia?.nombre}</strong>?
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

export default ModalEliminacionMembresia;