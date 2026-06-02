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
    >

      <Form onSubmit={handleSubmit}>

        <Modal.Header closeButton>

          <Modal.Title>

            Registrar Membresía

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Form.Group className="mb-3">

            <Form.Label>

              Nombre

            </Form.Label>

            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>

              Descripción

            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>

              Precio

            </Form.Label>

            <Form.Control
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>

              Duración en días

            </Form.Label>

            <Form.Control
              type="number"
              value={duracionDias}
              onChange={(e) =>
                setDuracionDias(
                  e.target.value
                )
              }
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>

              Estado

            </Form.Label>

            <Form.Select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value)
              }
            >

              <option value="Activa">
                Activa
              </option>

              <option value="Inactiva">
                Inactiva
              </option>

            </Form.Select>

          </Form.Group>

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
            variant="success"
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