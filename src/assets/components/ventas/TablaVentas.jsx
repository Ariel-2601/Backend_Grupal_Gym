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
                    <th>Total</th>
                    <th>Método Pago</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>

            </thead>

            <tbody>

                {ventas.length === 0 ? (

                    <tr>
                        <td
                            colSpan="6"
                            className="text-center"
                        >
                            No hay ventas registradas
                        </td>
                    </tr>

                ) : (

                    ventas.map((venta) => (

                        <tr key={venta.id_venta}>

                            <td>{venta.id_venta}</td>

                            <td>
                                {
                                    venta.clientes
                                        ? `${venta.clientes.nombres} ${venta.clientes.apellidos}`
                                        : "Sin cliente"
                                }
                            </td>

                            <td>
                                C$ {venta.total}
                            </td>

                            <td>
                                {venta.metodo_pago}
                            </td>

                            <td>
                                {venta.fecha_venta}
                            </td>

                            <td>

                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() =>
                                        onEditar(venta)
                                    }
                                >
                                    Editar
                                </Button>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        onEliminar(venta)
                                    }
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