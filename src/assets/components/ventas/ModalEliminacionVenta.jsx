/* eslint-disable react/prop-types */

import React from "react";

import {
  Modal,
  Button
} from "react-bootstrap";

const ModalEliminacionVenta = ({
  mostrar,
  setMostrar,
  venta,
  eliminarVenta
}) => {

  const handleEliminar = async () => {

    await eliminarVenta(
      venta.id_venta
    );

  };

  return (

    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Eliminar Venta
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        ¿Estás seguro de eliminar la venta con ID:

        <strong>
          {" "}#{venta?.id_venta}
        </strong>

        ?

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={() => setMostrar(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
        >
          Eliminar
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalEliminacionVenta;