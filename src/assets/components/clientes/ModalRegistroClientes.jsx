import React, { useState } from 'react';

import {
    Modal,
    Button,
    Form
} from 'react-bootstrap';

const ModalRegistroCliente = ({
    mostrar,
    setMostrar,
    agregarCliente,
    deshabilitado
}) => {

    const [nuevoCliente, setNuevoCliente] = useState({
        nombres: '',
        apellidos: '',
        edad: '',
        telefono: '',
        correo: '',
        estado: 'Activo'
    });

    // =========================
    // Cambios inputs
    // =========================

    const handleChange = (e) => {

        setNuevoCliente({
            ...nuevoCliente,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Guardar
    // =========================

    const handleSubmit = async () => {

        await agregarCliente(nuevoCliente);
    };

    // =========================
    // Cerrar modal
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

        setMostrar(false);
    };

    // =========================
    // Render
    // =========================

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

                    Registrar Nuevo Cliente

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    {/* Nombres */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Nombres
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="nombres"
                            placeholder="Ingrese los nombres"
                            value={nuevoCliente.nombres}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    {/* Apellidos */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Apellidos
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="apellidos"
                            placeholder="Ingrese los apellidos"
                            value={nuevoCliente.apellidos}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    {/* Edad */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Edad
                        </Form.Label>

                        <Form.Control
                            type="number"
                            name="edad"
                            placeholder="Ingrese la edad"
                            value={nuevoCliente.edad}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    {/* Teléfono */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Teléfono
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="telefono"
                            placeholder="Ingrese el teléfono"
                            value={nuevoCliente.telefono}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    {/* Correo */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Correo Electrónico
                        </Form.Label>

                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="Ingrese el correo"
                            value={nuevoCliente.correo}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    {/* Estado */}
                    <Form.Group className="mb-3">

                        <Form.Label>
                            Estado
                        </Form.Label>

                        <Form.Select
                            name="estado"
                            value={nuevoCliente.estado}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        >

                            <option value="Activo">
                                Activo
                            </option>

                            <option value="Inactivo">
                                Inactivo
                            </option>

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
                        !nuevoCliente.nombres.trim()
                    }
                >

                    {deshabilitado
                        ? 'Guardando...'
                        : 'Guardar'}

                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroCliente;