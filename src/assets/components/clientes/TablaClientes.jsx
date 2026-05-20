import React from 'react';
import {
    Table,
    Button,
    Spinner,
    Badge
} from 'react-bootstrap';

const TablaClientes = ({
  clientes,
  cargando,
  onEditar,
  onEliminar,
  generarPDFCliente
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
                        Cargando clientes...
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
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Edad</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th
                                style={{ width: '180px' }}
                                className="text-center"
                            >
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {clientes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-4 text-muted"
                                >
                                    No hay clientes registrados todavía.
                                </td>
                            </tr>
                        ) : (
                            clientes.map((cliente) => (
                                <tr key={cliente.id_cliente}>
                                    <td>
                                        <strong>#{cliente.id_cliente}</strong>
                                    </td>
                                    <td>{cliente.nombres}</td>
                                    <td>{cliente.apellidos}</td>
                                    <td>{cliente.edad}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.correo}</td>
                                    <td>
                                        <Badge
                                            bg={
                                                cliente.estado === "Activo" || 
                                                cliente.estado === 1
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {cliente.estado === 1 || 
                                             cliente.estado === "Activo" 
                                                ? "Activo" 
                                                : "Inactivo"}
                                        </Badge>
                                    </td>
                      <td className="text-center">
    
    {/* EDITAR */}
    <Button
        variant="warning"
        size="sm"
        className="me-2"
        title="Editar"
        onClick={() => onEditar(cliente)}
    >
        <i className="bi bi-pencil-square"></i>
    </Button>

    {/* PDF */}
    <Button
        variant="primary"
        size="sm"
        className="me-2"
        title="Generar PDF"
        onClick={() => generarPDFCliente(cliente)}
    >
        <i className="bi bi-file-earmark-pdf"></i>
    </Button>

    {/* ELIMINAR */}
    <Button
        variant="danger"
        size="sm"
        title="Eliminar"
        onClick={() => onEliminar(cliente)}
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

export default TablaClientes;