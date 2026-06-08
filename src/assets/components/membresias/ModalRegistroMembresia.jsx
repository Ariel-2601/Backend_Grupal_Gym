import React, { useState } from "react";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

const ModalRegistroMembresia = ({
  mostrar,
  setMostrar,
  agregarMembresia,
}) => {

  const [nombre, setNombre] = useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [precio, setPrecio] = useState("");

  const [duracionDias, setDuracionDias] =
    useState("");

  const [estado, setEstado] =
    useState("Activa");

  const handleSubmit = (e) => {

    e.preventDefault();

    agregarMembresia({

      nombre,

      descripcion,

      precio,

      duracion_dias: duracionDias,

      estado

    });

    limpiarFormulario();

    setMostrar(false);
  };

  const limpiarFormulario = () => {

    setNombre("");

    setDescripcion("");

    setPrecio("");

    setDuracionDias("");

    setEstado("Activa");
  };

  return (

<Modal
  show={mostrar}
  onHide={() => setMostrar(false)}
  centered
  size="lg"
>

      <Form onSubmit={handleSubmit}>

        <Modal.Header closeButton>

          <Modal.Title>

            Registrar Membresía

          </Modal.Title>

        </Modal.Header>

    <Modal.Body className="py-2">

  <div className="row">

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          size="sm"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Duración en días</Form.Label>
        <Form.Control
          size="sm"
          type="number"
          value={duracionDias}
          onChange={(e) => setDuracionDias(e.target.value)}
          required
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Estado</Form.Label>
        <Form.Select
          size="sm"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="Activa">Activa</option>
          <option value="Inactiva">Inactiva</option>
        </Form.Select>
      </Form.Group>
    </div>

    <div className="col-12">
      <Form.Group className="mb-2">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          size="sm"
          as="textarea"
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </Form.Group>
    </div>

  </div>

</Modal.Body>

<Modal.Footer className="py-2">

  <Button
    variant="secondary"
    size="sm"
    onClick={() => setMostrar(false)}
  >
    Cancelar
  </Button>

  <Button
    variant="success"
    size="sm"
    type="submit"
  >
    Registrar
  </Button>

</Modal.Footer>

      </Form>

    </Modal>
  );
};

export default ModalRegistroMembresia;