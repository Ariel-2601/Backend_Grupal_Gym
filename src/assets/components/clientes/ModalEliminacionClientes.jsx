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
    const [mostrarExito, setMostrarExito] = useState(false);

    // =========================
    // Confirmar Eliminación
    // =========================
    const handleEliminar = async () => {
        if (!cliente?.id_cliente) return;

        setDeshabilitado(true);

        try {
            await eliminarCliente(cliente.id_cliente);
            // Mostrar animación de éxito en vez de cerrar inmediatamente
            setMostrarExito(true);
            setTimeout(() => {
                setMostrarExito(false);
                setMostrar(false);
                setDeshabilitado(false);
            }, 2000);
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            setDeshabilitado(false);
        }
    };

    // =========================
    // Cerrar modal
    // =========================
    const handleCerrar = () => {
        setDeshabilitado(false);
        setMostrar(false);
        setMostrarExito(false);
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
            {!mostrarExito ? (
                <>
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
                </>
            ) : (
                // Animación de éxito
                <Modal.Body className="p-0">
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}>
                        <div>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.2rem",
                                animation: "scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                boxShadow: "0 8px 25px rgba(34,197,94,0.4)",
                            }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <polyline
                                        points="8,20 16,30 32,12"
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ animation: "drawCheck 0.4s ease 0.2s both" }}
                                    />
                                </svg>
                            </div>
                            <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                                ¡Cliente eliminado!
                            </h5>
                            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                                El registro se eliminó correctamente.
                            </p>
                        </div>
                    </div>
                    <style>{`
                        @keyframes scaleIn {
                            from { transform: scale(0); }
                            to { transform: scale(1); }
                        }
                        @keyframes drawCheck {
                            from { stroke-dashoffset: 50; stroke-dasharray: 50; }
                            to { stroke-dashoffset: 0; stroke-dasharray: 50; }
                        }
                    `}</style>
                </Modal.Body>
            )}
        </Modal>
    );
};

export default ModalEliminacionCliente;