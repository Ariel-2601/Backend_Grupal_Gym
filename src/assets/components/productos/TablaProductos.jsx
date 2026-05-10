import React from 'react';

import {
    Table,
    Button,
    Spinner
} from 'react-bootstrap';

const TablaProductos = ({
    productos,
    cargando,
    onEditar,
    onEliminar
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
                        Cargando productos...
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

                            <th style={{ width: '80px' }}>
                                ID
                            </th>

                            <th>
                                Nombre
                            </th>

                            <th>
                                Precio
                            </th>

                            <th>
                                Stock
                            </th>

                            <th
                                style={{ width: '180px' }}
                                className="text-center"
                            >
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {productos.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-4 text-muted"
                                >
                                    No hay productos registrados todavía.
                                </td>

                            </tr>

                        ) : (

                            productos.map((producto) => (

                                <tr key={producto.id_producto}>

                                    <td>
                                        <strong>
                                            #{producto.id_producto}
                                        </strong>
                                    </td>

                                    <td>
                                        {producto.nombre_producto}
                                    </td>

                                    <td className="fw-bold">

                                        $
                                        {parseFloat(
                                            producto.precio || 0
                                        ).toFixed(2)}

                                    </td>

                                    <td>
                                        {producto.stock}
                                    </td>

                                    <td className="text-center">

                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            title="Editar"
                                            onClick={() =>
                                                onEditar(producto)
                                            }
                                        >

                                            <i className="bi bi-pencil-square"></i>

                                        </Button>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            title="Eliminar"
                                            onClick={() =>
                                                onEliminar(producto)
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

export default TablaProductos;