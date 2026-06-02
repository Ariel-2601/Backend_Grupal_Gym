/* eslint-disable react/prop-types */

import React from "react";

import {
  Table,
  Button
} from "react-bootstrap";

const TablaMembresia = ({
  membresias,
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

          <th>Nombre</th>

          <th>Precio</th>

          <th>Duración</th>

          <th>Estado</th>

          <th>Acciones</th>

        </tr>

      </thead>

      <tbody>

        {membresias.length > 0 ? (

          membresias.map((membresia) => (

            <tr
              key={
                membresia.id_membresia
              }
            >

              <td>
                {
                  membresia.id_membresia
                }
              </td>

              <td>
                {
                  membresia.nombre
                }
              </td>

              <td>
                C$
                {
                  membresia.precio
                }
              </td>

              <td>

                {
                  membresia.duracion_dias
                } días

              </td>

              <td>

                {
                  membresia.estado
                }

              </td>

              <td>

                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() =>
                    onEditar(
                      membresia
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
                      membresia
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
              colSpan="6"
              className="text-center"
            >

              No hay membresías registradas

            </td>

          </tr>
        )}

      </tbody>

    </Table>
  );
};

export default TablaMembresia;