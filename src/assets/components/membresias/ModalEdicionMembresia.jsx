/* =========================
ModalEdicionMembresia.jsx
========================= */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect
} from "react";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

const ModalEdicionMembresia = ({
  mostrar,
  setMostrar,
  membresia,
  actualizarMembresia,
}) => {

  const [nombre, setNombre] =
    useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [precio, setPrecio] =
    useState("");

  const [duracionDias, setDuracionDias] =
    useState("");

  const [estado, setEstado] =
    useState("Activa");

  useEffect(() => {

    if (membresia) {

      setNombre(
        membresia.nombre || ""
      );

      setDescripcion(
        membresia.descripcion || ""
      );

      setPrecio(
        membresia.precio || ""
      );

      setDuracionDias(
        membresia.duracion_dias || ""
      );

      setEstado(
        membresia.estado || "Activa"
      );
    }

  }, [membresia]);

  const handleSubmit = (e) => {

    e.preventDefault();

    actualizarMembresia({

      ...membresia,

      nombre,

      descripcion,

      precio,

      duracion_dias: duracionDias,

      estado

    });

    setMostrar(false);
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

            Editar Membresía

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
            variant="primary"
            type="submit"
          >

            Guardar Cambios

          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  );
};

export default ModalEdicionMembresia;