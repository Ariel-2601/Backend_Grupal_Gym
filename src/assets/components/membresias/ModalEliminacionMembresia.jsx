/* =========================
ModalEliminacionMembresia.jsx
========================= */

/* eslint-disable react/prop-types */

import React from "react";

import {
  Modal,
  Button
} from "react-bootstrap";

const ModalEliminacionMembresia = ({
  mostrar,
  setMostrar,
  membresia,
  eliminarMembresia,
}) => {

  const handleEliminar = () => {

    eliminarMembresia(
      membresia.id_membresia
    );

    setMostrar(false);
  };

  return (

    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>

          Eliminar Membresía

        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        ¿Seguro que deseas eliminar la membresía{" "}

        <strong>

          {membresia?.nombre}

        </strong>

        ?

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={() =>
            setMostrar(false)
          }
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

export default ModalEliminacionMembresia;