/* eslint-disable react/prop-types */

import React from "react";

import {
  Modal,
  Button
} from "react-bootstrap";

const ModalEliminacionAsistencias = ({
  mostrar,
  setMostrar,
  asistencia,
  eliminarAsistencia,
}) => {

  const handleEliminar = () => {

    eliminarAsistencia(
      asistencia.id_asistencia
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

          Eliminar Asistencia

        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        ¿Estás seguro de eliminar la asistencia de{" "}

        <strong>

          {asistencia?.clientes?.nombres}{" "}
          {asistencia?.clientes?.apellidos}

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

export default ModalEliminacionAsistencias;