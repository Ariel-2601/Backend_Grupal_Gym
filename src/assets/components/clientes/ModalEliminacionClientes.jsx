import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  show,
  handleClose,
  handleEliminar,
  cliente,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro de eliminar al cliente{" "}
        <strong>{cliente?.nombre}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={() => handleEliminar(cliente.id)}
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;