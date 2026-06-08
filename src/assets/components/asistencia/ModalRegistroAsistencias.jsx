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

const ModalRegistroAsistencias = ({
  mostrar,
  setMostrar,
  agregarAsistencia,
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

  useEffect(() => {

    cargarClientes();

  }, []);

  // =========================
  // Registrar
  // =========================

  const handleSubmit = (e) => {

    e.preventDefault();

    agregarAsistencia({

      id_cliente: idCliente,

      fecha,

      hora_entrada: horaEntrada,

      hora_salida: horaSalida,

      observacion

    });

    limpiarFormulario();

    setMostrar(false);
  };

  // =========================
  // Limpiar
  // =========================

  const limpiarFormulario = () => {

    setIdCliente("");

    setFecha("");

    setHoraEntrada("");

    setHoraSalida("");

    setObservacion("");
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

            Registrar Asistencia

          </Modal.Title>

        </Modal.Header>

     <Modal.Body className="py-2">

  <div className="row">

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Cliente</Form.Label>

        <Form.Select
          size="sm"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
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
              {cliente.nombres} {cliente.apellidos}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Fecha</Form.Label>

        <Form.Control
          size="sm"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Hora Entrada</Form.Label>

        <Form.Control
          size="sm"
          type="time"
          value={horaEntrada}
          onChange={(e) => setHoraEntrada(e.target.value)}
          required
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-2">
        <Form.Label>Hora Salida</Form.Label>

        <Form.Control
          size="sm"
          type="time"
          value={horaSalida}
          onChange={(e) => setHoraSalida(e.target.value)}
        />
      </Form.Group>
    </div>

    <div className="col-12">
      <Form.Group className="mb-2">
        <Form.Label>Observación</Form.Label>

        <Form.Control
          size="sm"
          as="textarea"
          rows={2}
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
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

export default ModalRegistroAsistencias;