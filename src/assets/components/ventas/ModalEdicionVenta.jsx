/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEdicionVenta = ({
    mostrar,
    setMostrar,
    venta,
    actualizarVenta,
    clientes = [],
    productos = []
}) => {

    const [ventaEditada, setVentaEditada] = useState({
        id_venta: "",
        id_cliente: "",
        total: 0,
        metodo_pago: "",
        fecha_venta: ""
    });

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoActual, setProductoActual] = useState({ 
        id_producto: "", 
        cantidad: 1 
    });

    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (venta) {
            setVentaEditada({
                id_venta: venta.id_venta,
                id_cliente: venta.id_cliente || "",
                total: venta.total || 0,
                metodo_pago: venta.metodo_pago || "",
                fecha_venta: venta.fecha_venta ? venta.fecha_venta.split('T')[0] : ""
            });

            // Cargar productos existentes
            const prods = venta.detalle_ventas?.map(det => ({
                id_producto: det.productos?.id_producto || det.id_producto,
                nombre_producto: det.productos?.nombre_producto || "Producto eliminado",
                precio: det.productos?.precio || 0,           // ← Necesario
                cantidad: det.cantidad
            })) || [];

            setProductosSeleccionados(prods);
        }
    }, [venta]);

    const handleChange = (e) => {
        setVentaEditada({
            ...ventaEditada,
            [e.target.name]: e.target.value
        });
    };

    const handleClienteChange = (e) => {
        setVentaEditada({ 
            ...ventaEditada, 
            id_cliente: e.target.value 
        });
    };

    const agregarProducto = () => {
        if (!productoActual.id_producto || productoActual.cantidad < 1) return;

        const productoEncontrado = productos.find(p => 
            p.id_producto === parseInt(productoActual.id_producto)
        );

        if (!productoEncontrado) return;

        // Evitar duplicados
        if (productosSeleccionados.some(p => p.id_producto === productoEncontrado.id_producto)) {
            alert("Este producto ya fue agregado");
            return;
        }

        setProductosSeleccionados([...productosSeleccionados, {
            ...productoEncontrado,
            cantidad: parseInt(productoActual.cantidad)
        }]);

        setProductoActual({ id_producto: "", cantidad: 1 });
    };

    const cambiarCantidad = (index, nuevaCantidad) => {
        const nuevosProductos = [...productosSeleccionados];
        nuevosProductos[index].cantidad = parseInt(nuevaCantidad) || 1;
        setProductosSeleccionados(nuevosProductos);
    };

    const eliminarProducto = (index) => {
        setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
    };

    // Calcular total automáticamente
    const totalCalculado = productosSeleccionados.reduce((sum, prod) => {
        return sum + (prod.precio * prod.cantidad);
    }, 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ventaEditada.id_cliente) {
            alert("Debes seleccionar un cliente");
            return;
        }
        if (productosSeleccionados.length === 0) {
            alert("Debes tener al menos un producto");
            return;
        }

        const ventaActualizada = {
            ...ventaEditada,
            total: totalCalculado,
            productos: productosSeleccionados
        };

        actualizarVenta(ventaActualizada);
        setMostrar(false);
    };

    return (
        <Modal show={mostrar} onHide={() => setMostrar(false)} centered size="lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Venta</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Cliente */}
                    <Form.Group className="mb-3">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Select
                            value={ventaEditada.id_cliente}
                            onChange={handleClienteChange}
                            required
                        >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map((c) => (
                                <option key={c.id_cliente} value={c.id_cliente}>
                                    {c.nombres} {c.apellidos || ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Agregar Productos */}
                    <Form.Group className="mb-3">
                        <Form.Label>Agregar Producto</Form.Label>
                        <Row>
                            <Col md={6}>
                                <Form.Select
                                    value={productoActual.id_producto}
                                    onChange={(e) => setProductoActual({ 
                                        ...productoActual, 
                                        id_producto: e.target.value 
                                    })}
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {productos.map(p => (
                                        <option key={p.id_producto} value={p.id_producto}>
                                            {p.nombre_producto} - ${p.precio}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={productoActual.cantidad}
                                    onChange={(e) => setProductoActual({ 
                                        ...productoActual, 
                                        cantidad: e.target.value 
                                    })}
                                />
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" onClick={agregarProducto} className="w-100">
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Lista de Productos */}
                    <div className="mb-3">
                        <h6>Productos en esta venta:</h6>
                        {productosSeleccionados.length === 0 ? (
                            <p className="text-muted">No hay productos</p>
                        ) : (
                            productosSeleccionados.map((prod, index) => (
                                <Row key={index} className="border p-2 mb-2 rounded align-items-center">
                                    <Col md={5}>
                                        <strong>{prod.nombre_producto}</strong>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={prod.cantidad}
                                            onChange={(e) => cambiarCantidad(index, e.target.value)}
                                            size="sm"
                                        />
                                    </Col>
                                    <Col md={2} className="text-end">
                                        ${(prod.precio * prod.cantidad).toFixed(2)}
                                    </Col>
                                    <Col md={2}>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => eliminarProducto(index)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>

                    <div className="text-end mb-4">
                        <h5>Total: <strong className="text-success">${totalCalculado.toFixed(2)}</strong></h5>
                    </div>

                    {/* Método de Pago y Fecha */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="metodo_pago"
                                    value={ventaEditada.metodo_pago}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha_venta"
                                    value={ventaEditada.fecha_venta}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrar(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEdicionVenta;