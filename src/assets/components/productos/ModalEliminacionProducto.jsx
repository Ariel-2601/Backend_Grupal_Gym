import React, { useState } from 'react';
import {
    Modal,
    Button,
    Spinner
} from 'react-bootstrap';

const ModalEliminacionProducto = ({
    mostrar,
    setMostrar,
    producto,
    eliminarProducto
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (!producto?.id_producto) return;

        setDeshabilitado(true);

        try {
            await eliminarProducto(producto.id_producto);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        } finally {
            setDeshabilitado(false);
        }
    };

    const handleCerrar = () => {
        setDeshabilitado(false);
        setMostrar(false);
    };

    if (!producto) return null;

    return (
        <Modal
            show={mostrar}
            onHide={handleCerrar}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="bi bi-trash me-2"></i>
                    Confirmar Eliminación
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center py-4">
                    <i 
                        className="bi bi-exclamation-triangle-fill text-danger mb-3" 
                        style={{ fontSize: '3.8rem' }}
                    ></i>
                    
                    <h5>¿Estás seguro de eliminar este producto?</h5>
                    <p className="text-muted">
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="mt-4 p-3 bg-light rounded border">
                        <strong>{producto.nombre_producto}</strong><br />
                        <small className="text-muted">
                            ID: #{producto.id_producto} | Stock: {producto.stock}
                        </small>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleCerrar}
                    disabled={deshabilitado}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    {deshabilitado ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Eliminando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-trash me-1"></i>
                            Sí, Eliminar Producto
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionProducto;