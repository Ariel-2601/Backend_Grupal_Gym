/* eslint-disable react/prop-types */

import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({
  show,
  handleClose,
  venta,
  eliminarVenta,
}) => {
  const handleEliminar = () => {
    eliminarVenta(venta.id);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro de eliminar la venta de{" "}
        <strong>{venta?.producto}</strong>?
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

export default ModalEliminacionVenta;