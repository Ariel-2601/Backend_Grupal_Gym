import React, { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Spinner          // ← ¡ESTO FALTABA!
} from 'react-bootstrap';

const ModalRegistroCliente = ({
    mostrar,
    setMostrar,
    agregarCliente
}) => {

    const [nuevoCliente, setNuevoCliente] = useState({
        nombres: '',
        apellidos: '',
        edad: '',
        telefono: '',
        correo: '',
        estado: 'Activo'
    });

    const [deshabilitado, setDeshabilitado] = useState(false);

    // =========================
    // Manejo de cambios en inputs
    // =========================
    const handleChange = (e) => {
        setNuevoCliente({
            ...nuevoCliente,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Guardar Cliente
    // =========================
    const handleSubmit = async () => {
        setDeshabilitado(true);

        try {
            await agregarCliente(nuevoCliente);
        } catch (error) {
            console.error("Error en modal:", error);
        } finally {
            setDeshabilitado(false);
        }
    };

    // =========================
    // Cerrar y Limpiar Modal
    // =========================
    const handleCerrar = () => {
        setNuevoCliente({
            nombres: '',
            apellidos: '',
            edad: '',
            telefono: '',
            correo: '',
            estado: 'Activo'
        });
        setDeshabilitado(false);
        setMostrar(false);
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
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Nuevo Cliente
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
                            value={nuevoCliente.nombres}
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
                            value={nuevoCliente.apellidos}
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
                            value={nuevoCliente.edad}
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
                            value={nuevoCliente.telefono}
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
                            value={nuevoCliente.correo}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={nuevoCliente.estado}
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
                    disabled={deshabilitado || !nuevoCliente.nombres.trim()}
                >
                    {deshabilitado ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Guardando...
                        </>
                    ) : (
                        'Guardar Cliente'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCliente;