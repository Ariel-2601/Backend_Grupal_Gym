/* eslint-disable react/prop-types */

import React from "react";

import {
  Table,
  Button
} from "react-bootstrap";

const TablaAsistencias = ({
  asistencias,
  onEditar,
  onEliminar,
}) => {

  return (

    <Table
      striped
      bordered
      hover
      responsive
    >

      <thead>

        <tr>

          <th>ID</th>

          <th>Cliente</th>

          <th>Fecha</th>

          <th>Hora Entrada</th>

          <th>Hora Salida</th>

          <th>Observación</th>

          <th>Acciones</th>

        </tr>

      </thead>

      <tbody>

        {asistencias.length > 0 ? (

          asistencias.map((asistencia) => (

            <tr
              key={
                asistencia.id_asistencia
              }
            >

              <td>

                {
                  asistencia.id_asistencia
                }

              </td>

              <td>

                {
                  asistencia.clientes?.nombres
                }{" "}

                {
                  asistencia.clientes?.apellidos
                }

              </td>

              <td>

                {
                  asistencia.fecha
                }

              </td>

              <td>

                {
                  asistencia.hora_entrada
                }

              </td>

              <td>

                {
                  asistencia.hora_salida
                }

              </td>

              <td>

                {
                  asistencia.observacion
                }

              </td>

              <td>

                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() =>
                    onEditar(
                      asistencia
                    )
                  }
                >

                  Editar

                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    onEliminar(
                      asistencia
                    )
                  }
                >

                  Eliminar

                </Button>

              </td>

            </tr>
          ))

        ) : (

          <tr>

            <td
              colSpan="7"
              className="text-center"
            >

              No hay asistencias registradas

            </td>

          </tr>
        )}

      </tbody>

    </Table>
  );
};

export default TablaAsistencias;