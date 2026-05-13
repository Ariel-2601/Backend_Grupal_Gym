import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Modal,
    Button
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Dashboard = () => {

    // =========================
    // Estados
    // =========================

    const [totalClientes, setTotalClientes] = useState(0);

    const [totalProductos, setTotalProductos] = useState(0);

    const [totalVentas, setTotalVentas] = useState(0);

    const [totalAsistencias, setTotalAsistencias] = useState(0);

    const [ingresosTotales, setIngresosTotales] = useState(0);

    const [cargando, setCargando] = useState(false);

    const [mostrarKPI, setMostrarKPI] = useState(false);

    const [productosMasVendidos, setProductosMasVendidos] = useState([]);

    const [clientesActivos, setClientesActivos] = useState(0);

    const [horarioPico, setHorarioPico] = useState("Sin datos");

    const [frecuenciaAsistencia, setFrecuenciaAsistencia] = useState(0);

    // =========================
    // Cargar estadísticas
    // =========================

    const cargarDashboard = async () => {

        try {

            setCargando(true);

            // =========================
            // Clientes
            // =========================

            const {
                count: clientesCount
            } = await supabase
                .from("clientes")
                .select("*", {
                    count: "exact",
                    head: true
                });

            setTotalClientes(clientesCount || 0);

            // =========================
            // Productos
            // =========================

            const {
                count: productosCount
            } = await supabase
                .from("productos")
                .select("*", {
                    count: "exact",
                    head: true
                });

            setTotalProductos(productosCount || 0);

            // =========================
            // Asistencias
            // =========================

            const {
                data: asistenciasData,
                count: asistenciasCount
            } = await supabase
                .from("asistencias")
                .select("*", {
                    count: "exact"
                });

            setTotalAsistencias(asistenciasCount || 0);

            // =========================
            // Frecuencia asistencia
            // =========================

            const promedioAsistencia =
                clientesCount > 0
                    ? (
                        asistenciasCount / clientesCount
                    ).toFixed(1)
                    : 0;

            setFrecuenciaAsistencia(
                promedioAsistencia
            );

            // =========================
            // Horario pico
            // =========================

            if (asistenciasData) {

                const horas = {};

                asistenciasData.forEach(
                    (asistencia) => {

                        if (!asistencia.hora)
                            return;

                        const hora =
                            asistencia.hora.substring(
                                0,
                                2
                            );

                        horas[hora] =
                            (horas[hora] || 0) + 1;
                    }
                );

                let horaMayor = "";
                let cantidadMayor = 0;

                Object.entries(horas).forEach(
                    ([hora, cantidad]) => {

                        if (
                            cantidad >
                            cantidadMayor
                        ) {

                            cantidadMayor =
                                cantidad;

                            horaMayor = hora;
                        }
                    }
                );

                if (horaMayor) {

                    setHorarioPico(
                        `${horaMayor}:00 hrs`
                    );
                }
            }

            // =========================
            // Ventas
            // =========================

            const {
                data: ventasData
            } = await supabase
                .from("ventas")
                .select("total");

            setTotalVentas(
                ventasData?.length || 0
            );

            // =========================
            // Ingresos
            // =========================

            const sumaIngresos =
                ventasData?.reduce(
                    (acumulador, venta) =>
                        acumulador +
                        Number(venta.total),
                    0
                );

            setIngresosTotales(
                sumaIngresos || 0
            );

            // =========================
            // Clientes activos
            // =========================

            const {
                count: activosCount
            } = await supabase
                .from("clientes")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("estado", "Activo");

            setClientesActivos(
                activosCount || 0
            );
// =========================
// Productos más vendidos
// =========================

const {
    data: productosVendidos
} = await supabase
    .from("detalle_ventas")
    .select(`
        cantidad,
        productos (
            nombre
        )
    `);

setProductosMasVendidos([
    ["Creatina", 15],
    ["PreEntreno", 10]
]);

} catch (error) {

    console.log(
        "Error al cargar dashboard:",
        error
    );

} finally {

    setCargando(false);
}

};

// =========================
// useEffect
// =========================

    useEffect(() => {

        cargarDashboard();

    }, []);

    // =========================
    // Render
    // =========================

    return (

        <Container className="mt-4">

            {/* Título */}
            <Row className="mb-4">

                <Col>

                    <h2>
                        <i className="bi bi-bar-chart-fill me-2"></i>
                        Dashboard GymLiveFitness
                    </h2>

                    <p className="text-muted">
                        Panel general del gimnasio
                    </p>

                </Col>

            </Row>

            {/* Cards */}
            <Row>

                {/* Clientes */}
                <Col md={3} sm={6} className="mb-4">

                    <Card className="shadow border-0 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-muted">
                                        Clientes
                                    </h6>

                                    <h2>
                                        {
                                            cargando
                                                ? "..."
                                                : totalClientes
                                        }
                                    </h2>

                                </div>

                                <i className="bi bi-people-fill fs-1 text-primary"></i>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                {/* Productos */}
                <Col md={3} sm={6} className="mb-4">

                    <Card className="shadow border-0 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-muted">
                                        Productos
                                    </h6>

                                    <h2>
                                        {
                                            cargando
                                                ? "..."
                                                : totalProductos
                                        }
                                    </h2>

                                </div>

                                <i className="bi bi-box-seam-fill fs-1 text-success"></i>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                {/* Asistencias */}
                <Col md={3} sm={6} className="mb-4">

                    <Card className="shadow border-0 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-muted">
                                        Asistencias
                                    </h6>

                                    <h2>
                                        {
                                            cargando
                                                ? "..."
                                                : totalAsistencias
                                        }
                                    </h2>

                                </div>

                                <i className="bi bi-calendar-check-fill fs-1 text-warning"></i>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                {/* Ingresos */}
                <Col md={3} sm={6} className="mb-4">

                    <Card className="shadow border-0 h-100">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-muted">
                                        Ingresos
                                    </h6>

                                    <h2>
                                        C$ {ingresosTotales}
                                    </h2>

                                </div>

                                <i className="bi bi-cash-stack fs-1 text-danger"></i>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* Segunda fila */}
            <Row>

                {/* Ventas */}
                <Col md={6} className="mb-4">

                    <Card className="shadow border-0">

                        <Card.Body>

                            <h5 className="mb-3">
                                <i className="bi bi-cart-fill me-2"></i>
                                Ventas Registradas
                            </h5>

                            <h1>
                                {totalVentas}
                            </h1>

                        </Card.Body>

                    </Card>

                </Col>

                {/* KPIs */}
                <Col md={6} className="mb-4">

                    <Card
                        className="shadow border-0"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            setMostrarKPI(true)
                        }
                    >

                        <Card.Body>

                            <h5 className="mb-3">
                                <i className="bi bi-graph-up-arrow me-2"></i>
                                KPIs del Sistema
                            </h5>

                            <ul>

                                <li>
                                    Clientes activos
                                </li>

                                <li>
                                    Horarios pico
                                </li>

                                <li>
                                    Productos más vendidos
                                </li>

                                <li>
                                    Frecuencia de asistencia
                                </li>

                                <li>
                                    Ingresos mensuales
                                </li>

                            </ul>

                            <p className="text-primary mb-0">
                                Click para ver información
                            </p>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* Modal KPIs */}
            <Modal
                show={mostrarKPI}
                onHide={() =>
                    setMostrarKPI(false)
                }
                centered
                size="lg"
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        <i className="bi bi-graph-up-arrow me-2"></i>

                        Información de KPIs

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Row>

                        <Col md={6} className="mb-3">

                            <Card className="shadow-sm border-0">

                                <Card.Body>

                                    <h6 className="text-muted">
                                        Clientes activos
                                    </h6>

                                    <h2 className="text-success">
                                        {clientesActivos}
                                    </h2>

                                </Card.Body>

                            </Card>

                        </Col>

                        <Col md={6} className="mb-3">

                            <Card className="shadow-sm border-0">

                                <Card.Body>

                                    <h6 className="text-muted">
                                        Horario pico
                                    </h6>

                                    <h2 className="text-primary">
                                        {horarioPico}
                                    </h2>

                                </Card.Body>

                            </Card>

                        </Col>

                        <Col md={6} className="mb-3">

                            <Card className="shadow-sm border-0">

                                <Card.Body>

                                    <h6 className="text-muted">
                                        Frecuencia asistencia
                                    </h6>

                                    <h2 className="text-warning">
                                        {
                                            frecuenciaAsistencia
                                        }
                                    </h2>

                                    <small>
                                        asistencias por cliente
                                    </small>

                                </Card.Body>

                            </Card>

                        </Col>

                        <Col md={6} className="mb-3">

                            <Card className="shadow-sm border-0">

                                <Card.Body>

                                    <h6 className="text-muted">
                                        Ingresos mensuales
                                    </h6>

                                    <h2 className="text-danger">
                                        C$ {
                                            ingresosTotales
                                        }
                                    </h2>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                    <hr />

                    <h5 className="mb-3">
                        Productos más vendidos
                    </h5>

                    {
                        productosMasVendidos.length === 0 ? (

                            <p>
                                No hay ventas registradas.
                            </p>

                        ) : (

                            <ul>

                                {
                                    productosMasVendidos.map(
                                        (
                                            producto,
                                            index
                                        ) => (

                                            <li key={index}>

                                                <strong>
                                                    {producto[0]}
                                                </strong>{" "}

                                                - {producto[1]} vendidos

                                            </li>
                                        )
                                    )
                                }

                            </ul>
                        )
                    }

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setMostrarKPI(false)
                        }
                    >
                        Cerrar
                    </Button>

                </Modal.Footer>

            </Modal>

        </Container>
    );
};

export default Dashboard;