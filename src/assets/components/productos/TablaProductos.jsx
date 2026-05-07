/* eslint-disable react/prop-types */

import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaProductos = ({
  productos,
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
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.stock}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEditar(producto)}
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminar(producto)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No hay productos registrados
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaProductos;