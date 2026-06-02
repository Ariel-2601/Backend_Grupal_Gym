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
    const [diaMayorConcurrencia, setDiaMayorConcurrencia] = useState("Sin datos");
const [productoMasVendido, setProductoMasVendido] = useState("Sin datos");

    // =========================
    // Cargar estadísticas
    // =========================

    const cargarDashboard = async () => {
        try {
            setCargando(true);

            // =========================
            // Total Clientes
            // =========================
            const { count: clientesCount } = await supabase
                .from("clientes")
                .select("*", { count: "exact", head: true });

            setTotalClientes(clientesCount || 0);

            // =========================
            // Total Productos
            // =========================
            const { count: productosCount } = await supabase
                .from("productos")
                .select("*", { count: "exact", head: true });

            setTotalProductos(productosCount || 0);

            // =========================
            // Asistencias
            // =========================
            const { data: asistenciasData, count: asistenciasCount } = await supabase
                .from("asistencias")
                .select("*", { count: "exact" });

            setTotalAsistencias(asistenciasCount || 0);

            // Frecuencia promedio de asistencia
            const promedioAsistencia = clientesCount > 0 
                ? (asistenciasCount / clientesCount).toFixed(1) 
                : 0;
            setFrecuenciaAsistencia(promedioAsistencia);

            // =========================
            // Horario Pico
            // =========================
            if (asistenciasData) {
                const horas = {};
                asistenciasData.forEach((asistencia) => {
                    if (!asistencia.hora) return;
                    const hora = asistencia.hora.substring(0, 2);
                    horas[hora] = (horas[hora] || 0) + 1;
                });

                let horaMayor = "";
                let cantidadMayor = 0;

                Object.entries(horas).forEach(([hora, cantidad]) => {
                    if (cantidad > cantidadMayor) {
                        cantidadMayor = cantidad;
                        horaMayor = hora;
                    }
                });

                if (horaMayor) {
                    setHorarioPico(`${horaMayor}:00 hrs`);
                }
                const dias = {};

asistenciasData.forEach((asistencia) => {

    if (!asistencia.fecha) return;

    const fecha = new Date(asistencia.fecha);

    const nombreDia = fecha.toLocaleDateString("es-ES", {
        weekday: "long"
    });

    dias[nombreDia] = (dias[nombreDia] || 0) + 1;
});

let mejorDia = "";
let mayorCantidad = 0;

Object.entries(dias).forEach(([dia, cantidad]) => {

    if (cantidad > mayorCantidad) {
        mayorCantidad = cantidad;
        mejorDia = dia;
    }
});

if (mejorDia) {
    setDiaMayorConcurrencia(mejorDia);
}
            }

// =========================
// Horario de mayor afluencia (CORREGIDO)
// =========================
if (asistenciasData && asistenciasData.length > 0) {
    const conteoHoras = {};

    asistenciasData.forEach((asistencia) => {
        // AQUÍ ESTABA EL ERROR: Cambiamos 'asistencia.hora' por 'asistencia.hora_entrada'
        const valorHora = asistencia.hora_entrada; 
        
        if (valorHora) {
            // Extraemos la hora (ej: "18" de "18:30:00")
            const hora = valorHora.toString().split(':')[0];
            conteoHoras[hora] = (conteoHoras[hora] || 0) + 1;
        }
    });

    let horaPico = null;
    let maxVisitas = 0;

    Object.entries(conteoHoras).forEach(([hora, cantidad]) => {
        if (cantidad > maxVisitas) {
            maxVisitas = cantidad;
            horaPico = hora;
        }
    });

    if (horaPico) {
        const hInicio = parseInt(horaPico);
        const hFin = (hInicio + 1) % 24;
        setHorarioPico(`${hInicio.toString().padStart(2, '0')}:00 - ${hFin.toString().padStart(2, '0')}:00 hrs`);
    } else {
        setHorarioPico("Sin datos");
    }
}

            // =========================
            // Ventas e Ingresos
            // =========================
            const { data: ventasData } = await supabase
                .from("ventas")
                .select("total");

            const totalVentasCount = ventasData?.length || 0;
            setTotalVentas(totalVentasCount);

            const sumaIngresos = ventasData?.reduce((acumulador, venta) => 
                acumulador + Number(venta.total || 0), 0) || 0;
            setIngresosTotales(sumaIngresos);

            // =========================
            // Clientes Activos
            // =========================
            const { count: activosCount } = await supabase
                .from("clientes")
                .select("*", { count: "exact", head: true })
                .eq("estado", "Activo");

            setClientesActivos(activosCount || 0);

            // =========================
            // PRODUCTOS MÁS VENDIDOS (REAL)
            // =========================
            const { data: detalleVentas } = await supabase
                .from("detalle_ventas")
                .select(`
                    cantidad,
                    productos (
                        nombre_producto
                    )
                `);

            if (detalleVentas && detalleVentas.length > 0) {
                const productosAgrupados = {};

                detalleVentas.forEach(item => {
                    const nombre = item.productos?.nombre_producto || "Producto sin nombre";
                    const cantidad = Number(item.cantidad) || 0;

                    productosAgrupados[nombre] = (productosAgrupados[nombre] || 0) + cantidad;
                });

                const productosOrdenados = Object.entries(productosAgrupados)
                    .map(([nombre, cantidad]) => [nombre, cantidad])
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8);

                setProductosMasVendidos(productosOrdenados);
                if (productosOrdenados.length > 0) {
    setProductoMasVendido(productosOrdenados[0][0]);
}
            } else {
                setProductosMasVendidos([]);
            }

        } catch (error) {
            console.log("Error al cargar dashboard:", error);
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
                    <p className="text-muted">Panel general del gimnasio</p>
                </Col>
            </Row>

            {/* Cards Principales */}
            <Row>
                <Col md={3} sm={6} className="mb-4">
                    <Card className="shadow border-0 h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Clientes Totales</h6>
                                    <h2>{cargando ? "..." : totalClientes}</h2>
                                </div>
                                <i className="bi bi-people-fill fs-1 text-primary"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} sm={6} className="mb-4">
                    <Card className="shadow border-0 h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Productos</h6>
                                    <h2>{cargando ? "..." : totalProductos}</h2>
                                </div>
                                <i className="bi bi-box-seam-fill fs-1 text-success"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} sm={6} className="mb-4">
                    <Card className="shadow border-0 h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Asistencias</h6>
                                    <h2>{cargando ? "..." : totalAsistencias}</h2>
                                </div>
                                <i className="bi bi-calendar-check-fill fs-1 text-warning"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3} sm={6} className="mb-4">
                    <Card className="shadow border-0 h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Ingresos Totales</h6>
                                    <h2 className="text-success">
                                        $ {ingresosTotales.toLocaleString()}
                                    </h2>
                                </div>
                                <i className="bi bi-cash-stack fs-1 text-success"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Segunda fila */}
            <Row>
                <Col md={6} className="mb-4">
                    <Card className="shadow border-0">
                        <Card.Body>
                            <h5 className="mb-3">
                                <i className="bi bi-cart-fill me-2"></i>
                                Ventas Registradas
                            </h5>
                            <h1>{totalVentas}</h1>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card 
                        className="shadow border-0" 
                        style={{ cursor: "pointer" }}
                        onClick={() => setMostrarKPI(true)}
                    >
                        <Card.Body>
                            <h5 className="mb-3">
                                <i className="bi bi-graph-up-arrow me-2"></i>
                                KPIs del Sistema
                            </h5>
                            <p className="text-primary mb-0">Click para ver información detallada</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal KPIs */}
            <Modal
                show={mostrarKPI}
                onHide={() => setMostrarKPI(false)}
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
                        Horario de Mayor Afluencia
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
                        Día Más Concurrido
                    </h6>
                    <h2 className="text-success text-capitalize">
                        {diaMayorConcurrencia}
                    </h2>
                </Card.Body>
            </Card>
        </Col>

        <Col md={6} className="mb-3">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <h6 className="text-muted">
                        Frecuencia Promedio
                    </h6>
                    <h2 className="text-warning">
                        {frecuenciaAsistencia}
                    </h2>
                </Card.Body>
            </Card>
        </Col>

        <Col md={6} className="mb-3">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <h6 className="text-muted">
                        Producto Más Vendido
                    </h6>
                    <h2 className="text-danger">
                        {productoMasVendido}
                    </h2>
                </Card.Body>
            </Card>
        </Col>

        <Col md={12} className="mb-3">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <h6 className="text-muted">
                        Ingresos Totales
                    </h6>
                    <h2 className="text-success">
                        $ {ingresosTotales.toLocaleString()}
                    </h2>
                </Card.Body>
            </Card>
        </Col>

    </Row>

    <hr />

    <h5 className="mb-3">
        Ranking de Productos Más Vendidos
    </h5>

    {productosMasVendidos.length === 0 ? (
        <p className="text-muted">
            No hay ventas registradas aún.
        </p>
    ) : (
        <ul className="list-group">
            {productosMasVendidos.map((producto, index) => (
                <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                >
                    <strong>
                        #{index + 1} {producto[0]}
                    </strong>

                    <span className="badge bg-primary rounded-pill fs-6">
                        {producto[1]} unidades
                    </span>
                </li>
            ))}
        </ul>
    )}

</Modal.Body>

<Modal.Footer>
    <Button
        variant="secondary"
        onClick={() => setMostrarKPI(false)}
    >
        Cerrar
    </Button>
</Modal.Footer>

</Modal>

</Container>
);
};

export default Dashboard;