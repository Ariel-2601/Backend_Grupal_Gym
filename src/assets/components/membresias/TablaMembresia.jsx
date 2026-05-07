/* eslint-disable react/prop-types */
import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaMembresias = ({
  membresias,
  abrirModalEditar,
  abrirModalEliminar,
}) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Duración</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {membresias.length > 0 ? (
          membresias.map((membresia) => (
            <tr key={membresia.id}>
              <td>{membresia.id}</td>
              <td>{membresia.nombre}</td>
              <td>${membresia.precio}</td>
              <td>{membresia.duracion}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEditar(membresia)}
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminar(membresia)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No hay membresías registradas
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaMembresias;