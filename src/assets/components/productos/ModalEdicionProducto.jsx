import React, { useState, useEffect } from 'react';

import {
    Modal,
    Button,
    Form,
    Spinner
} from 'react-bootstrap';

const ModalEdicionProducto = ({
    mostrar,
    setMostrar,
    producto,
    actualizarProducto
}) => {

    const [productoEditado, setProductoEditado] = useState({
        id_producto: '',
        nombre_producto: '',
        precio: '',
        stock: ''
    });

    const [deshabilitado, setDeshabilitado] = useState(false);

    // =========================
    // Cargar datos
    // =========================

    useEffect(() => {

        if (producto) {

            setProductoEditado({
                id_producto: producto.id_producto,

                nombre_producto:
                    producto.nombre_producto || '',

                precio:
                    producto.precio || '',

                stock:
                    producto.stock || ''
            });
        }

    }, [producto]);

    // =========================
    // Cambios inputs
    // =========================

    const handleChange = (e) => {

        setProductoEditado({
            ...productoEditado,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // Guardar cambios
    // =========================

    const handleSubmit = async () => {

        if (!productoEditado.nombre_producto.trim())
            return;

        setDeshabilitado(true);

        try {

            await actualizarProducto(
                productoEditado
            );

        } catch (error) {

            console.error(
                "Error al actualizar producto:",
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
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Producto
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
                                productoEditado.nombre_producto
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
                                        productoEditado.precio
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
                                    placeholder="Cantidad disponible"
                                    value={
                                        productoEditado.stock
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
                        !productoEditado.nombre_producto.trim()
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

export default ModalEdicionProducto;