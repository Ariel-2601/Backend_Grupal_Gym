import React, { useState } from 'react';

import {
    Modal,
    Button,
    Form,
    Spinner
} from 'react-bootstrap';

const ModalRegistroProducto = ({
    mostrar,
    setMostrar,
    agregarProducto
}) => {

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre_producto: '',
        precio: '',
        stock: ''
    });

    const [deshabilitado, setDeshabilitado] = useState(false);

    // =========================
    // Cambios inputs
    // =========================

    const handleChange = (e) => {

        setNuevoProducto({
            ...nuevoProducto,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Guardar producto
    // =========================

    const handleSubmit = async () => {

        if (!nuevoProducto.nombre_producto.trim())
            return;

        setDeshabilitado(true);

        try {

            await agregarProducto(
                nuevoProducto
            );

        } catch (error) {

            console.error(
                "Error en modal:",
                error
            );

        } finally {

            setDeshabilitado(false);
        }
    };

    // =========================
    // Cerrar modal
    // =========================

    const handleCerrar = () => {

        setNuevoProducto({
            nombre_producto: '',
            precio: '',
            stock: ''
        });

        setDeshabilitado(false);

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
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar Nuevo Producto
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Nombre del Producto
                            <span className="text-danger">
                                *
                            </span>
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="nombre_producto"
                            placeholder="Ej: Proteína Whey 2kg"
                            value={
                                nuevoProducto.nombre_producto
                            }
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />

                    </Form.Group>

                    <div className="row">

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Precio ($)
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="precio"
                                    placeholder="0.00"
                                    value={
                                        nuevoProducto.precio
                                    }
                                    onChange={handleChange}
                                    disabled={deshabilitado}
                                />

                            </Form.Group>

                        </div>

                        <div className="col-md-6">

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Stock
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    name="stock"
                                    placeholder="Cantidad"
                                    value={
                                        nuevoProducto.stock
                                    }
                                    onChange={handleChange}
                                    disabled={deshabilitado}
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
                    disabled={
                        deshabilitado ||
                        !nuevoProducto.nombre_producto.trim()
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

                            Guardando...
                        </>
                    ) : (
                        'Guardar Producto'
                    )}

                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroProducto;