/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Badge } from "react-bootstrap";

const ModalRegistroVenta = ({
    mostrar,
    setMostrar,
    agregarVenta,
    clientes = [],
    productos = []
}) => {

    const [nuevaVenta, setNuevaVenta] = useState({
        id_cliente: "",
        total: "",
        metodo_pago: "",
        fecha_venta: new Date().toISOString().split('T')[0]
    });

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id_producto: "",
        cantidad: 1
    });

    const handleChange = (e) => {
        setNuevaVenta({
            ...nuevaVenta,
            [e.target.name]: e.target.value
        });
    };

    const handleClienteChange = (e) => {
        setNuevaVenta({ ...nuevaVenta, id_cliente: e.target.value });
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

    // Resetear el selector
    setProductoActual({ id_producto: "", cantidad: 1 });
};
    const eliminarProducto = (index) => {
        setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
    };

    // Calcular total automáticamente
    const totalCalculado = productosSeleccionados.reduce((sum, prod) => {
        return sum + (prod.precio * prod.cantidad);
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nuevaVenta.id_cliente) {
            alert("Debes seleccionar un cliente");
            return;
        }
        if (productosSeleccionados.length === 0) {
            alert("Debes agregar al menos un producto");
            return;
        }

        const ventaConProductos = {
            ...nuevaVenta,
            total: totalCalculado,
            productos: productosSeleccionados
        };

        await agregarVenta(ventaConProductos);
        
        // Resetear formulario
        setNuevaVenta({
            id_cliente: "",
            total: "",
            metodo_pago: "",
            fecha_venta: new Date().toISOString().split('T')[0]
        });
        setProductosSeleccionados([]);
    };

    return (
        <Modal show={mostrar} onHide={() => setMostrar(false)} centered size="lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Venta</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Cliente */}
                    <Form.Group className="mb-3">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Select
                            value={nuevaVenta.id_cliente}
                            onChange={handleClienteChange}
                            required
                        >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                    {cliente.nombres} {cliente.apellidos || ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Selección de Productos */}
                    <Form.Group className="mb-3">
                        <Form.Label>Agregar Productos</Form.Label>
                        <Row>
                            <Col md={6}>
                                <Form.Select
                                    value={productoActual.id_producto}
                                    onChange={(e) => setProductoActual({ ...productoActual, id_producto: e.target.value })}
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {productos.map((prod) => (
                                        <option key={prod.id_producto} value={prod.id_producto}>
                                            {prod.nombre_producto} - ${prod.precio}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={productoActual.cantidad}
                                    onChange={(e) => setProductoActual({ ...productoActual, cantidad: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" onClick={agregarProducto} className="w-100">
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Productos Seleccionados */}
                    {productosSeleccionados.length > 0 && (
                        <div className="mb-3">
                            <h6>Productos agregados:</h6>
                            {productosSeleccionados.map((prod, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center border p-2 mb-1 rounded">
                                    <div>
                                        {prod.nombre_producto} × {prod.cantidad} 
                                        <span className="text-muted ms-2">
                                            (${(prod.precio * prod.cantidad).toFixed(2)})
                                        </span>
                                    </div>
                                    <Button variant="danger" size="sm" onClick={() => eliminarProducto(index)}>
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                            <div className="text-end mt-2">
                                <strong>Total: ${totalCalculado.toFixed(2)}</strong>
                            </div>
                        </div>
                    )}

                    {/* Método de Pago */}
                    <Form.Group className="mb-3">
                        <Form.Label>Método de Pago</Form.Label>
                        <Form.Control
                            type="text"
                            name="metodo_pago"
                            value={nuevaVenta.metodo_pago}
                            onChange={handleChange}
                            placeholder="Efectivo, Tarjeta, Transferencia..."
                            required
                        />
                    </Form.Group>

                    {/* Fecha */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_venta"
                            value={nuevaVenta.fecha_venta}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrar(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">
                        Registrar Venta
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalRegistroVenta;