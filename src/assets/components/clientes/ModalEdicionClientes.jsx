import React, { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    Form,
    Spinner
} from 'react-bootstrap';

const ModalEdicionClientes = ({
    mostrar,
    setMostrar,
    cliente,
    actualizarCliente
}) => {

    const [clienteEditado, setClienteEditado] = useState({
        id_cliente: '',
        nombres: '',
        apellidos: '',
        edad: '',
        telefono: '',
        correo: '',
        estado: 'Activo'
    });

    const [deshabilitado, setDeshabilitado] = useState(false);

    // =========================
    // Cargar datos del cliente cuando se abre el modal
    // =========================
    useEffect(() => {
        if (cliente) {
            setClienteEditado({
                id_cliente: cliente.id_cliente,
                nombres: cliente.nombres || '',
                apellidos: cliente.apellidos || '',
                edad: cliente.edad || '',
                telefono: cliente.telefono || '',
                correo: cliente.correo || '',
                estado: cliente.estado || 'Activo'
            });
        }
    }, [cliente]);

    // =========================
    // Manejo de cambios en inputs
    // =========================
    const handleChange = (e) => {
        setClienteEditado({
            ...clienteEditado,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Guardar cambios
    // =========================
    const handleSubmit = async () => {
        if (!clienteEditado.nombres.trim()) return;

        setDeshabilitado(true);

        try {
            await actualizarCliente(clienteEditado);
            // El cierre del modal se maneja desde el componente padre
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
        } finally {
            setDeshabilitado(false);
        }
    };

    // =========================
    // Cerrar modal
    // =========================
    const handleCerrar = () => {
        setMostrar(false);
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrar}
            onHide={handleCerrar}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Cliente
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombres <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="nombres"
                            placeholder="Ingrese los nombres"
                            value={clienteEditado.nombres}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellidos"
                            placeholder="Ingrese los apellidos"
                            value={clienteEditado.apellidos}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control
                            type="number"
                            name="edad"
                            placeholder="Ingrese la edad"
                            value={clienteEditado.edad}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            placeholder="Ingrese el teléfono"
                            value={clienteEditado.telefono}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="ejemplo@correo.com"
                            value={clienteEditado.correo}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={clienteEditado.estado}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
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
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={
                        deshabilitado || 
                        !clienteEditado.nombres.trim()
                    }
                >
                    {deshabilitado ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Actualizando...
                        </>
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionClientes;