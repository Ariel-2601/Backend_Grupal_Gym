import React, { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card
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
                count: asistenciasCount
            } = await supabase
                .from("asistencias")
                .select("*", {
                    count: "exact",
                    head: true
                });

            setTotalAsistencias(asistenciasCount || 0);

            // =========================
            // Ventas
            // =========================

            const {
                data: ventasData
            } = await supabase
                .from("ventas")
                .select("total");

            setTotalVentas(ventasData?.length || 0);

            // =========================
            // Ingresos
            // =========================

            const sumaIngresos = ventasData?.reduce(
                (acumulador, venta) =>
                    acumulador + Number(venta.total),
                0
            );

            setIngresosTotales(sumaIngresos || 0);

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
                                        {cargando
                                            ? "..."
                                            : totalClientes}
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
                                        {cargando
                                            ? "..."
                                            : totalProductos}
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
                                        {cargando
                                            ? "..."
                                            : totalAsistencias}
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

                {/* Información */}
                <Col md={6} className="mb-4">

                    <Card className="shadow border-0">

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

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>
    );
};

export default Dashboard;