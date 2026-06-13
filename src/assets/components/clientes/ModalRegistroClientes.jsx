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
    centered
    size="lg"
>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Nuevo Cliente
                </Modal.Title>
            </Modal.Header>

          <Modal.Body>
    <Form>
        <div className="row">

            <div className="col-md-6">
                <Form.Group className="mb-2">
                    <Form.Label>Nombres *</Form.Label>
                    <Form.Control
                        size="sm"
                        type="text"
                        name="nombres"
                        value={nuevoCliente.nombres}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

            <div className="col-md-6">
                <Form.Group className="mb-2">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                        size="sm"
                        type="text"
                        name="apellidos"
                        value={nuevoCliente.apellidos}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

            <div className="col-md-6">
                <Form.Group className="mb-2">
                    <Form.Label>Edad</Form.Label>
                    <Form.Control
                        size="sm"
                        type="number"
                        name="edad"
                        value={nuevoCliente.edad}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

            <div className="col-md-6">
                <Form.Group className="mb-2">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        size="sm"
                        type="text"
                        name="telefono"
                        value={nuevoCliente.telefono}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

            <div className="col-md-6">
                <Form.Group className="mb-2">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                        size="sm"
                        type="email"
                        name="correo"
                        value={nuevoCliente.correo}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

        </div>
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