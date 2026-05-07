/* eslint-disable react/prop-types */

import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaAsistencias = ({
  asistencias,
  abrirModalEditar,
  abrirModalEliminar,
}) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Hora de Entrada</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {asistencias.length > 0 ? (
          asistencias.map((asistencia) => (
            <tr key={asistencia.id}>
              <td>{asistencia.id}</td>
              <td>{asistencia.cliente}</td>
              <td>{asistencia.fecha}</td>
              <td>{asistencia.horaEntrada}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEditar(asistencia)}
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminar(asistencia)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No hay asistencias registradas
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaAsistencias;