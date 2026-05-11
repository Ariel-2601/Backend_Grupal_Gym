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

import { supabase } from "../../database/supabaseconfig";

const ModalEdicionAsistencias = ({
  mostrar,
  setMostrar,
  asistencia,
  actualizarAsistencia,
}) => {

  const [clientes, setClientes] =
    useState([]);

  const [idCliente, setIdCliente] =
    useState("");

  const [fecha, setFecha] =
    useState("");

  const [horaEntrada, setHoraEntrada] =
    useState("");

  const [horaSalida, setHoraSalida] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  // =========================
  // Cargar clientes
  // =========================

  const cargarClientes = async () => {

    const { data, error } =
      await supabase
        .from("clientes")
        .select("*")
        .order("nombres", {
          ascending: true
        });

    if (!error) {

      setClientes(data || []);
    }
  };

  // =========================
  // Cargar datos asistencia
  // =========================

  useEffect(() => {

    cargarClientes();

    if (asistencia) {

      setIdCliente(
        asistencia.id_cliente || ""
      );

      setFecha(
        asistencia.fecha || ""
      );

      setHoraEntrada(
        asistencia.hora_entrada || ""
      );

      setHoraSalida(
        asistencia.hora_salida || ""
      );

      setObservacion(
        asistencia.observacion || ""
      );
    }

  }, [asistencia]);

  // =========================
  // Actualizar
  // =========================

  const handleSubmit = (e) => {

    e.preventDefault();

    actualizarAsistencia({

      ...asistencia,

      id_cliente: idCliente,

      fecha,

      hora_entrada: horaEntrada,

      hora_salida: horaSalida,

      observacion

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

            Editar Asistencia

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {/* Cliente */}

          <Form.Group className="mb-3">

            <Form.Label>

              Cliente

            </Form.Label>

            <Form.Select
              value={idCliente}
              onChange={(e) =>
                setIdCliente(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Seleccione un cliente
              </option>

              {clientes.map((cliente) => (

                <option
                  key={cliente.id_cliente}
                  value={cliente.id_cliente}
                >

                  {cliente.nombres}{" "}
                  {cliente.apellidos}

                </option>
              ))}

            </Form.Select>

          </Form.Group>

          {/* Fecha */}

          <Form.Group className="mb-3">

            <Form.Label>

              Fecha

            </Form.Label>

            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) =>
                setFecha(e.target.value)
              }
              required
            />

          </Form.Group>

          {/* Hora entrada */}

          <Form.Group className="mb-3">

            <Form.Label>

              Hora Entrada

            </Form.Label>

            <Form.Control
              type="time"
              value={horaEntrada}
              onChange={(e) =>
                setHoraEntrada(
                  e.target.value
                )
              }
              required
            />

          </Form.Group>

          {/* Hora salida */}

          <Form.Group className="mb-3">

            <Form.Label>

              Hora Salida

            </Form.Label>

            <Form.Control
              type="time"
              value={horaSalida}
              onChange={(e) =>
                setHoraSalida(
                  e.target.value
                )
              }
            />

          </Form.Group>

          {/* Observación */}

          <Form.Group className="mb-3">

            <Form.Label>

              Observación

            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={observacion}
              onChange={(e) =>
                setObservacion(
                  e.target.value
                )
              }
            />

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

export default ModalEdicionAsistencias;