import React from "react";
import {
  Table,
  Button,
  Spinner,
  Badge
} from "react-bootstrap";

const TablaMembresia = ({
  membresias,
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
            Cargando membresías...
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
                Nombre
              </th>

              <th>
                Precio
              </th>

              <th>
                Duración
              </th>

              <th>
                Estado
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
            {membresias.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-muted"
                >
                  No hay membresías registradas.
                </td>
              </tr>
            ) : (
              membresias.map((membresia) => (
                <tr
                  key={membresia.id_membresia}
                >
                  <td>
                    <strong>
                      #{membresia.id_membresia}
                    </strong>
                  </td>

                  <td>
                    {membresia.nombre}
                  </td>

                  <td>
                    <strong>
                      C$ {Number(membresia.precio).toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    {membresia.duracion_dias} días
                  </td>

                  <td>
                    <Badge
                      bg={
                        membresia.estado === "Activa"
                          ? "success"
                          : "danger"
                      }
                    >
                      {membresia.estado}
                    </Badge>
                  </td>

                  <td className="text-center">

                    {/* EDITAR */}
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      title="Editar"
                      onClick={() =>
                        onEditar(membresia)
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
                        onEliminar(membresia)
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

export default TablaMembresia;