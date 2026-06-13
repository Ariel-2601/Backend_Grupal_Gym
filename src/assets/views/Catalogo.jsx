import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Badge,
    Modal,
    Button
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Catalogo = () => {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const obtenerProductos = async () => {

        setCargando(true);

        const { data, error } = await supabase
            .from("productos")
            .select("*");

        if (error) {
            console.log(error);
        } else {
            setProductos(data);
        }

        setCargando(false);
    };

    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModal(true);
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    // Filtrar productos según búsqueda
    const productosFiltrados = productos.filter((producto) => {
        const textoBusqueda = busqueda.toLowerCase().trim();
        if (!textoBusqueda) return true;

        const nombre = (producto.nombre_producto || "").toLowerCase();
        const categoria = (producto.categoria_producto || "").toLowerCase();

        return nombre.includes(textoBusqueda) || categoria.includes(textoBusqueda);
    });

    if (cargando) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="py-4">

            <h1 className="text-center mb-5">
                Catálogo de Productos
            </h1>

            {/* Cuadro de búsqueda */}
            <div className="d-flex justify-content-center mb-4">
                <div className="position-relative" style={{ width: "100%", maxWidth: "500px" }}>
                    <span 
                        className="position-absolute" 
                        style={{ 
                            left: "16px", 
                            top: "50%", 
                            transform: "translateY(-50%)",
                            fontSize: "18px",
                            color: "#94a3b8",
                            pointerEvents: "none"
                        }}
                    >
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="form-control"
                        style={{
                            padding: "12px 16px 12px 48px",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontSize: "15px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#4F46E5";
                            e.target.style.boxShadow = "0 2px 12px rgba(79, 70, 229, 0.15)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                        }}
                    />
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className="position-absolute"
                            style={{
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                fontSize: "16px",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: "4px",
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Contador de resultados */}
            {busqueda && (
                <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
                    {productosFiltrados.length} {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"} 
                    {productosFiltrados.length !== productos.length && ` de ${productos.length}`}
                </p>
            )}

            <Row>

                {productosFiltrados.map((producto) => (

                    <Col
                        key={producto.id_producto}
                        md={6}
                        lg={4}
                        xl={3}
                        className="mb-4"
                    >

                        <Card
                            className="h-100 shadow border-0"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s"
                            }}
                            onClick={() => verProducto(producto)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >

                            <Card.Img
                                variant="top"
                                src={
                                    producto.imagen ||
                                    "https://via.placeholder.com/300x250"
                                }
                                style={{
                                    height: "250px",
                                    objectFit: "contain",
                                    backgroundColor: "#f8f9fa",
                                    padding: "10px"
                                }}
                            />

                            <Card.Body>

                                <Badge
                                    bg="dark"
                                    className="mb-2"
                                >
                                    {producto.categoria_producto}
                                </Badge>

                                <Card.Title>
                                    {producto.nombre_producto}
                                </Card.Title>

                                <h4 className="text-success">
                                    ${producto.precio}
                                </h4>

                                <p>
                                    Stock disponible:{" "}
                                    <strong>
                                        {producto.stock}
                                    </strong>
                                </p>

                            </Card.Body>

                        </Card>

                    </Col>

                ))}

                {productosFiltrados.length === 0 && !cargando && (
                    <Col xs={12} className="text-center py-5">
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                        <h4 style={{ color: "#64748b", fontWeight: 600, marginBottom: "8px" }}>
                            No se encontraron productos
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                            Intenta con otro término de búsqueda
                        </p>
                    </Col>
                )}
            </Row>

            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                size="xl"
                centered
            >
                {productoSeleccionado && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {productoSeleccionado.nombre_producto}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>

                            <img
                                src={
                                    productoSeleccionado.imagen ||
                                    "https://via.placeholder.com/600x400"
                                }
                                alt={productoSeleccionado.nombre_producto}
                                className="img-fluid rounded mb-3"
                                style={{
                                    width: "100%",
                                    height: "600px",
                                    objectFit: "contain",
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px"
                                }}
                            />

                            <Badge
                                bg="dark"
                                className="mb-3"
                            >
                                {productoSeleccionado.categoria_producto}
                            </Badge>

                            <h2 className="text-success">
                                ${productoSeleccionado.precio}
                            </h2>

                            <hr />

                            <p>
                                <strong>Stock disponible:</strong>{" "}
                                {productoSeleccionado.stock}
                            </p>

                            <p>
                                <strong>Categoría:</strong>{" "}
                                {productoSeleccionado.categoria_producto}
                            </p>

                        </Modal.Body>

                        <Modal.Footer>

                            <Button
                                variant="secondary"
                                onClick={() => setMostrarModal(false)}
                            >
                                Cerrar
                            </Button>

                        </Modal.Footer>
                    </>
                )}
            </Modal>

        </Container>
    );
};

export default Catalogo;