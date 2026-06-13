import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Card, Badge } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Asistencias = () => {
    // =========================
    // Estados
    // =========================
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [asistenciasHoy, setAsistenciasHoy] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);
    const [registrando, setRegistrando] = useState(null);
    const [registrandoSalida, setRegistrandoSalida] = useState(null);

    // =========================
    // Toast
    // =========================
    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    // =========================
    // Helpers de fecha
    // =========================
    const hoyISO = () => new Date().toISOString().split("T")[0];
    const horaActual = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };

    // =========================
    // Cargar TODOS los clientes
    // =========================
    const cargarClientes = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("clientes")
                .select("id_cliente, nombres, apellidos, correo, telefono, estado")
                .order("nombres", { ascending: true });

            if (error) throw error;
            setClientes(data || []);
            setClientesFiltrados(data || []);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
            setToast({
                mostrar: true,
                mensaje: "Error al cargar clientes.",
                tipo: "danger"
            });
        } finally {
            setCargando(false);
        }
    };

    // =========================
    // Cargar asistencias de hoy
    // =========================
    const cargarAsistenciasHoy = async () => {
        try {
            const hoy = hoyISO();
            const { data, error } = await supabase
                .from("asistencias")
                .select(`
                    id_asistencia,
                    id_cliente,
                    fecha,
                    hora_entrada,
                    hora_salida,
                    clientes (nombres, apellidos)
                `)
                .eq("fecha", hoy)
                .order("hora_entrada", { ascending: false });

            if (error) throw error;
            setAsistenciasHoy(data || []);
        } catch (error) {
            console.error("Error al cargar asistencias:", error);
        }
    };

    // =========================
    // Suscribirse a cambios en tiempo real de clientes
    // =========================
    useEffect(() => {
        // Cargar datos iniciales
        cargarClientes();
        cargarAsistenciasHoy();

        // Suscribirse a cambios en la tabla clientes
        const subscription = supabase
            .channel('clientes_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'clientes'
                },
                (payload) => {
                    console.log('Cambio detectado en clientes:', payload);
                    // Recargar clientes cuando hay cambios
                    cargarClientes();

                    // Mostrar toast si se insertó un nuevo cliente
                    if (payload.eventType === 'INSERT') {
                        setToast({
                            mostrar: true,
                            mensaje: `🎉 Nuevo cliente agregado: ${payload.new.nombres} ${payload.new.apellidos}`,
                            tipo: "success"
                        });
                    }
                }
            )
            .subscribe();

        // Actualizar asistencias cada 30 segundos
        const interval = setInterval(() => {
            cargarAsistenciasHoy();
        }, 30000);

        return () => {
            subscription.unsubscribe();
            clearInterval(interval);
        };
    }, []);

    // =========================
    // Verificar si cliente ya asistió hoy
    // =========================
    const yaAsistioHoy = (clienteId) => {
        return asistenciasHoy.some(a => a.id_cliente === clienteId);
    };

    // =========================
    // Obtener asistencia activa de hoy (sin salida)
    // =========================
    const getAsistenciaActiva = (clienteId) => {
        return asistenciasHoy.find(
            a => a.id_cliente === clienteId && !a.hora_salida
        );
    };

    // =========================
    // Registrar asistencia rápida (CHECK-IN)
    // =========================
    const registrarAsistencia = async (cliente) => {
        if (yaAsistioHoy(cliente.id_cliente)) {
            setToast({
                mostrar: true,
                mensaje: `${cliente.nombres} ${cliente.apellidos} ya registró asistencia hoy.`,
                tipo: "warning"
            });
            return;
        }

        try {
            setRegistrando(cliente.id_cliente);

            const asistenciaData = {
                id_cliente: cliente.id_cliente,
                fecha: hoyISO(),
                hora_entrada: horaActual(),
                hora_salida: null,
                observacion: "Check-in rápido"
            };

            const { error } = await supabase
                .from("asistencias")
                .insert([asistenciaData]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: `✅ ${cliente.nombres} ${cliente.apellidos} registrado a las ${horaActual()}`,
                tipo: "success"
            });

            await cargarAsistenciasHoy();

        } catch (error) {
            console.error("Error al registrar asistencia:", error);
            setToast({
                mostrar: true,
                mensaje: "Error al registrar asistencia.",
                tipo: "danger"
            });
        } finally {
            setRegistrando(null);
        }
    };

    // =========================
    // Registrar salida
    // =========================
    const registrarSalida = async (asistencia) => {
        try {
            setRegistrandoSalida(asistencia.id_asistencia);

            const { error } = await supabase
                .from("asistencias")
                .update({
                    hora_salida: horaActual()
                })
                .eq("id_asistencia", asistencia.id_asistencia);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: `👋 ${asistencia.clientes?.nombres} ${asistencia.clientes?.apellidos} salió a las ${horaActual()}`,
                tipo: "success"
            });

            await cargarAsistenciasHoy();

        } catch (error) {
            console.error("Error al registrar salida:", error);
            setToast({
                mostrar: true,
                mensaje: "Error al registrar salida.",
                tipo: "danger"
            });
        } finally {
            setRegistrandoSalida(null);
        }
    };

    // =========================
    // Búsqueda de clientes
    // =========================
    const handleBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);

        const resultados = clientes.filter((cliente) =>
            cliente.nombres.toLowerCase().includes(texto) ||
            cliente.apellidos.toLowerCase().includes(texto) ||
            cliente.correo?.toLowerCase().includes(texto) ||
            cliente.telefono?.includes(texto)
        );

        setClientesFiltrados(resultados);
    };

    // =========================
    // Render
    // =========================
    return (
        <Container className="mt-3">
            {/* Encabezado */}
            <Row className="align-items-center mb-4">
                <Col>
                    <h3 className="mb-0">
                        <i className="bi bi-calendar-check-fill me-2"></i>
                        Control de Asistencias
                    </h3>
                    <p className="text-muted mb-0 mt-1">
                        {new Date().toLocaleDateString("es-ES", { 
                            weekday: "long", 
                            year: "numeric", 
                            month: "long", 
                            day: "numeric" 
                        })}
                    </p>
                </Col>
                <Col xs="auto" className="text-end">
                    <Badge bg="success" className="px-3 py-2" style={{ fontSize: "14px" }}>
                        <i className="bi bi-people-fill me-1"></i>
                        {asistenciasHoy.length} asistencias hoy
                    </Badge>
                </Col>
            </Row>

            <hr />

            {/* Buscador */}
            <Row className="mb-4">
                <Col md={6}>
                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        onChange={handleBusqueda}
                        placeholder="🔍 Buscar cliente por nombre, correo o teléfono..."
                    />
                </Col>
                <Col md={6} className="text-md-end mt-2 mt-md-0">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        {clientes.length} clientes en total · {clientes.filter(c => c.estado === "Activo").length} activos
                    </small>
                </Col>
            </Row>

            {/* Grid de clientes para check-in rápido */}
            <h5 className="mb-3">
                <i className="bi bi-person-check me-2"></i>
                Check-in Rápido — Toca para registrar
            </h5>

            {clientesFiltrados.length === 0 && !cargando ? (
                <Alert variant="warning">
                    No se encontraron clientes. 
                    <a href="/clientes" className="ms-2">Ir a Clientes para agregar uno nuevo</a>
                </Alert>
            ) : (
                <Row className="g-3">
                    {clientesFiltrados.map((cliente) => {
                        const asistio = yaAsistioHoy(cliente.id_cliente);
                        const asistenciaActiva = getAsistenciaActiva(cliente.id_cliente);
                        const asistenciaCompletada = asistenciasHoy.find(
                            a => a.id_cliente === cliente.id_cliente && a.hora_salida
                        );
                        const estaActivo = cliente.estado === "Activo";

                        // Determinar estado visual
                        let estadoColor, estadoIcon, estadoBg, estadoTexto;
                        if (asistenciaCompletada) {
                            estadoColor = "#6B7280";
                            estadoIcon = "✓";
                            estadoTexto = `Finalizado · ${asistenciaCompletada.hora_entrada} - ${asistenciaCompletada.hora_salida}`;
                            estadoBg = "linear-gradient(135deg, #E5E7EB, #D1D5DB)";
                        } else if (asistenciaActiva) {
                            estadoColor = "#10B981";
                            estadoIcon = "✓";
                            estadoTexto = `Activo · Entrada: ${asistenciaActiva.hora_entrada}`;
                            estadoBg = "linear-gradient(135deg, #10B981, #059669)";
                        } else if (!estaActivo) {
                            estadoColor = "#9CA3AF";
                            estadoIcon = "✕";
                            estadoTexto = "Cliente inactivo";
                            estadoBg = "linear-gradient(135deg, #E5E7EB, #D1D5DB)";
                        } else {
                            estadoColor = "#3B82F6";
                            estadoIcon = cliente.nombres.charAt(0).toUpperCase();
                            estadoTexto = "Tocar para registrar";
                            estadoBg = "linear-gradient(135deg, #3B82F6, #2563EB)";
                        }

                        return (
                            <Col key={cliente.id_cliente} xs={12} sm={6} md={4} lg={3}>
                                <Card 
                                    className="h-100 border-0 shadow-sm"
                                    style={{
                                        cursor: (!asistio && estaActivo) ? 'pointer' : 'default',
                                        transition: 'all 0.2s ease',
                                        transform: registrando === cliente.id_cliente ? 'scale(0.95)' : 'scale(1)',
                                        opacity: (asistenciaCompletada || !estaActivo) ? 0.7 : 1,
                                        borderWidth: !estaActivo ? "2px" : "0px",
                                        borderStyle: "dashed",
                                        borderColor: !estaActivo ? "#EF4444" : "transparent",
                                    }}
                                    onClick={() => {
                                        if (!asistio && estaActivo) {
                                            registrarAsistencia(cliente);
                                        }
                                    }}
                                >
                                    <Card.Body className="text-center p-4">
                                        {/* Avatar / Icono */}
                                        <div 
                                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: "50%",
                                                background: estadoBg,
                                                color: "white",
                                                fontSize: asistenciaActiva || asistenciaCompletada ? "28px" : "24px",
                                                fontWeight: 700,
                                                boxShadow: `0 4px 15px ${estadoColor}40`,
                                            }}
                                        >
                                            {asistenciaActiva || asistenciaCompletada ? (
                                                <i className="bi bi-check-lg"></i>
                                            ) : (
                                                estadoIcon
                                            )}
                                        </div>

                                        {/* Nombre */}
                                        <Card.Title className="mb-1" style={{ fontSize: "16px", fontWeight: 700 }}>
                                            {cliente.nombres} {cliente.apellidos}
                                        </Card.Title>

                                        {/* Estado del cliente */}
                                        {!estaActivo && (
                                            <Badge bg="danger" className="mb-2">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                Inactivo
                                            </Badge>
                                        )}

                                        {/* Estado de asistencia */}
                                        <div className="mt-2">
                                            {asistenciaCompletada ? (
                                                <Badge bg="secondary" className="px-3 py-2">
                                                    <i className="bi bi-check-circle-fill me-1"></i>
                                                    Finalizado
                                                </Badge>
                                            ) : asistenciaActiva ? (
                                                <div>
                                                    <Badge bg="success" className="px-3 py-2 mb-2">
                                                        <i className="bi bi-person-check me-1"></i>
                                                        Activo · {asistenciaActiva.hora_entrada}
                                                    </Badge>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="mt-2 w-100"
                                                        disabled={registrandoSalida === asistenciaActiva.id_asistencia}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            registrarSalida(asistenciaActiva);
                                                        }}
                                                    >
                                                        {registrandoSalida === asistenciaActiva.id_asistencia ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                Registrando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-box-arrow-right me-1"></i>
                                                                Registrar Salida
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            ) : estaActivo ? (
                                                <Badge 
                                                    bg="light" 
                                                    text="dark" 
                                                    className="px-3 py-2"
                                                    style={{ 
                                                        borderWidth: "1px", 
                                                        borderStyle: "solid", 
                                                        borderColor: "#E5E7EB" 
                                                    }}
                                                >
                                                    <i className="bi bi-hand-index-thumb me-1"></i>
                                                    Tocar para registrar
                                                </Badge>
                                            ) : (
                                                <Badge bg="light" text="dark" className="px-3 py-2">
                                                    <i className="bi bi-ban me-1"></i>
                                                    No disponible
                                                </Badge>
                                            )}
                                        </div>

                                        {registrando === cliente.id_cliente && (
                                            <div className="mt-2">
                                                <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                                                Registrando...
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Lista de asistencias de hoy */}
            {asistenciasHoy.length > 0 && (
                <>
                    <hr className="my-4" />
                    <h5 className="mb-3">
                        <i className="bi bi-clock-history me-2"></i>
                        Asistencias de Hoy ({asistenciasHoy.length})
                    </h5>
                    <Row className="g-2">
                        {asistenciasHoy.map((asistencia) => (
                            <Col key={asistencia.id_asistencia} xs={12} md={6} lg={4}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="d-flex align-items-center justify-content-between p-3">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: "50%",
                                                    background: asistencia.hora_salida 
                                                        ? "#E5E7EB" 
                                                        : "linear-gradient(135deg, #10B981, #059669)",
                                                    color: asistencia.hora_salida ? "#6B7280" : "white",
                                                    fontSize: "18px",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {asistencia.clientes?.nombres?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: "14px" }}>
                                                    {asistencia.clientes?.nombres} {asistencia.clientes?.apellidos}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: "12px" }}>
                                                    <i className="bi bi-clock me-1"></i>
                                                    Entrada: {asistencia.hora_entrada}
                                                    {asistencia.hora_salida && (
                                                        <span className="ms-2">
                                                            <i className="bi bi-box-arrow-right me-1"></i>
                                                            Salida: {asistencia.hora_salida}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge 
                                                bg={asistencia.hora_salida ? "secondary" : "success"}
                                                className="px-2 py-1"
                                            >
                                                {asistencia.hora_salida ? "Finalizado" : "Activo"}
                                            </Badge>
                                            {!asistencia.hora_salida && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="mt-1 w-100"
                                                    disabled={registrandoSalida === asistencia.id_asistencia}
                                                    onClick={() => registrarSalida(asistencia)}
                                                >
                                                    {registrandoSalida === asistencia.id_asistencia ? (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    ) : (
                                                        <i className="bi bi-box-arrow-right"></i>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* Toast */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Asistencias;