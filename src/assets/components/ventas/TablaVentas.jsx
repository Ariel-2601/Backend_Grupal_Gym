/* eslint-disable react/prop-types */

import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaVentas = ({
  ventas,
  abrirModalEditar,
  abrirModalEliminar,
}) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {ventas.length > 0 ? (
          ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.cliente}</td>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.total}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEditar(venta)}
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminar(venta)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">
              No hay ventas registradas
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TablaVentas;