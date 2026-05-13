import React from "react";

import {
    Table,
    Button,
    Spinner
} from "react-bootstrap";

const TablaVentas = ({
    ventas,
    cargando,
    onEditar,
    onEliminar
}) => {

    if (cargando) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Table
            striped
            bordered
            hover
            responsive
            className="align-middle"
        >
            <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total (USD)</th>
                    <th>Método Pago</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {ventas.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="text-center py-4">
                            No hay ventas registradas
                        </td>
                    </tr>
                ) : (
                    ventas.map((venta) => (
                        <tr key={venta.id_venta}>
                            {/* ID */}
                            <td>{venta.id_venta}</td>

                            {/* Cliente - CORREGIDO */}
                            <td className="fw-bold">
                                {venta.clientes 
                                    ? `${venta.clientes.nombres || ''} ${venta.clientes.apellidos || ''}`.trim()
                                    : "Cliente no registrado"
                                }
                            </td>

                            {/* Productos */}
                            <td>
                                {venta.detalle_ventas?.length > 0 ? (
                                    venta.detalle_ventas.map((detalle, index) => (
                                        <div key={index}>
                                            • {detalle.productos?.nombre_producto || "Producto eliminado"} 
                                            {" "} (x{detalle.cantidad})
                                        </div>
                                    ))
                                ) : (
                                    "Sin productos"
                                )}
                            </td>

                            {/* Total en DÓLARES */}
                            <td className="fw-bold text-success">
                                $ {parseFloat(venta.total || 0).toFixed(2)}
                            </td>

                            {/* Método de Pago */}
                            <td>
                                {venta.metodo_pago || "No especificado"}
                            </td>

                            {/* Fecha */}
                            <td>
                                {venta.fecha_venta || "Sin fecha"}
                            </td>

                            {/* Acciones */}
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEditar(venta)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onEliminar(venta)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
};

export default TablaVentas;