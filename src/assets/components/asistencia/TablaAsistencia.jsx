import React from "react";
import {
  Table,
  Button,
  Spinner
} from "react-bootstrap";

const TablaAsistencias = ({
  asistencias,
  cargando,
  onEditar,
  onEliminar,
}) => {

  return (
    <>
      {cargando ? (
        <div className="text-center py-5">
          <Spinner
            animation="border"
            variant="primary"
          />
          <p className="mt-3">
            Cargando asistencias...
          </p>
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle"
        >
          <thead className="table-dark">
            <tr>
              <th style={{ width: "80px" }}>
                ID
              </th>

              <th>
                Cliente
              </th>

              <th>
                Fecha
              </th>

              <th>
                Hora Entrada
              </th>

              <th>
                Hora Salida
              </th>

              <th>
                Observación
              </th>

              <th
                style={{ width: "140px" }}
                className="text-center"
              >
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {asistencias.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-muted"
                >
                  No hay asistencias registradas.
                </td>
              </tr>
            ) : (
              asistencias.map((asistencia) => (
                <tr
                  key={asistencia.id_asistencia}
                >
                  <td>
                    <strong>
                      #{asistencia.id_asistencia}
                    </strong>
                  </td>

                  <td>
                    {asistencia.clientes?.nombres}{" "}
                    {asistencia.clientes?.apellidos}
                  </td>

                  <td>
                    {asistencia.fecha}
                  </td>

                  <td>
                    {asistencia.hora_entrada}
                  </td>

                  <td>
                    {asistencia.hora_salida || "-"}
                  </td>

                  <td>
                    {asistencia.observacion || "-"}
                  </td>

                  <td className="text-center">

                    {/* EDITAR */}
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      title="Editar"
                      onClick={() =>
                        onEditar(asistencia)
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>

                    {/* ELIMINAR */}
                    <Button
                      variant="danger"
                      size="sm"
                      title="Eliminar"
                      onClick={() =>
                        onEliminar(asistencia)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </Button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaAsistencias;