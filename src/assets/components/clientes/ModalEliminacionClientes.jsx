import React, { useState } from 'react';
import {
    Modal,
    Button,
    Spinner
} from 'react-bootstrap';

const ModalEliminacionCliente = ({
    mostrar,
    setMostrar,
    cliente,
    eliminarCliente
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    // =========================
    // Confirmar Eliminación
    // =========================
    const handleEliminar = async () => {
        if (!cliente?.id_cliente) return;

        setDeshabilitado(true);

        try {
            await eliminarCliente(cliente.id_cliente);
            // El cierre del modal se maneja desde el componente padre
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        } finally {
            setDeshabilitado(false);
        }
    };

    // =========================
    // Cerrar modal
    // =========================
    const handleCerrar = () => {
        setDeshabilitado(false);
        setMostrar(false);
    };

    if (!cliente) return null;

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
                <div className="text-center py-3">
                    <i 
                        className="bi bi-exclamation-triangle-fill text-danger" 
                        style={{ fontSize: '3.5rem' }}
                    ></i>
                    
                    <h5 className="mt-3 mb-1">¿Estás seguro?</h5>
                    <p className="text-muted">
                        ¿Deseas eliminar permanentemente al cliente?
                    </p>

                    <div className="mt-4 p-3 bg-light rounded border">
                        <strong>Cliente:</strong><br />
                        <span className="fs-5">
                            {cliente.nombres} {cliente.apellidos}
                        </span>
                        <br />
                        <small className="text-muted">
                            ID: #{cliente.id_cliente}
                        </small>
                    </div>

                    <p className="text-danger mt-3 mb-0 small">
                        Esta acción no se puede deshacer.
                    </p>
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
                            Sí, Eliminar Cliente
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionCliente;