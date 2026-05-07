import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';

const TablaCategorias = ({ categorias, cargando, recargar }) => {

    return (
        <>
            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Cargando categorías...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Nombre de la Categoría</th>
                            <th>Descripción</th>
                            <th style={{ width: '180px' }} className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    No hay categorías registradas todavía.
                                </td>
                            </tr>
                        ) : (
                            categorias.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td><strong>#{categoria.id}</strong></td>
                                    <td><strong>{categoria.nombre_categoria}</strong></td>
                                    <td>
                                        {categoria.descripcion_categoria
                                            ? categoria.descripcion_categoria 
                                            : <em className="text-muted">Sin descripción</em>
                                        }
                                    </td>
                                    <td className="text-center">
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2"
                                            title="Editar"
                                            onClick={() => alert(`Editar categoría: ${categoria.nombre_categoria}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            title="Eliminar"
                                            onClick={() => {
                                                if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre_categoria}"?`)) {
                                                    alert('Funcionalidad de eliminar próximamente');
                                                    // Aquí luego conectarás con ModalEliminacionCategoria
                                                }
                                            }}
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

export default TablaCategorias;