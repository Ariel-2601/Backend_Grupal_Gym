import { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";
import { Table, Button, Modal, Form, Badge, Spinner, Row, Col, Card } from "react-bootstrap";

export default function MembresiasClientes() {
  const [membresiasClientes, setMembresiasClientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [esMobile, setEsMobile] = useState(window.innerWidth < 768);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [membresiaEditando, setMembresiaEditando] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [membresiaEliminar, setMembresiaEliminar] = useState(null);

  const [nuevaMembresia, setNuevaMembresia] = useState({
    cliente_id: "",
    membresia_id: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    fecha_vencimiento: "",
    estado: "Activa",
  });

  // ==================== DETECTAR TAMAÑO DE PANTALLA ====================
  useEffect(() => {
    const handleResize = () => setEsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMembresiasClientes();
    fetchClientes();
    fetchMembresias();
  }, []);

  // ==================== CARGAR DATOS ====================
  async function fetchMembresiasClientes() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("membresias_clientes")
        .select(`
          id,
          fecha_registro,
          fecha_vencimiento,
          estado,
          clientes (
            id_cliente,
            nombres,
            apellidos,
            correo,
            telefono
          ),
          membresias (
            id_membresia,
            nombre,
            precio,
            duracion_dias
          )
        `)
        .order("id", { ascending: false });

      if (error) throw error;

      const dataActualizada = await actualizarEstadosVencidos(data || []);
      setMembresiasClientes(dataActualizada);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las membresías: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function actualizarEstadosVencidos(data) {
    const resultado = await Promise.all(
      data.map(async (item) => {
        const dias = calcularDiasRestantes(item.fecha_vencimiento);
        if (
          dias !== null &&
          dias < 0 &&
          item.estado !== "Vencida" &&
          item.estado !== "Cancelada"
        ) {
          await supabase
            .from("membresias_clientes")
            .update({ estado: "Vencida" })
            .eq("id", item.id);
          return { ...item, estado: "Vencida" };
        }
        return item;
      })
    );
    return resultado;
  }

  async function fetchClientes() {
    const { data } = await supabase
      .from("clientes")
      .select("id_cliente, nombres, apellidos, correo")
      .order("nombres");
    setClientes(data || []);
  }

  async function fetchMembresias() {
    const { data } = await supabase
      .from("membresias")
      .select("id_membresia, nombre, precio, duracion_dias");
    setMembresias(data || []);
  }

  // ==================== EDITAR ====================
  function abrirEditar(item) {
    setMembresiaEditando({
      id: item.id,
      cliente_id: item.clientes?.id_cliente,
      membresia_id: item.membresias?.id_membresia,
      fecha_registro: item.fecha_registro,
      fecha_vencimiento: item.fecha_vencimiento,
      estado: item.estado,
    });
    setMostrarModalEditar(true);
  }

  async function guardarEdicion() {
    if (!membresiaEditando.fecha_vencimiento || !membresiaEditando.estado) {
      alert("Por favor completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("membresias_clientes")
      .update({
        membresia_id: membresiaEditando.membresia_id,
        fecha_vencimiento: membresiaEditando.fecha_vencimiento,
        estado: membresiaEditando.estado,
      })
      .eq("id", membresiaEditando.id);

    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }

    setMostrarModalEditar(false);
    setMembresiaEditando(null);
    setMostrarExito(true);
    setTimeout(() => setMostrarExito(false), 2500);
    fetchMembresiasClientes();
  }

  // ==================== ELIMINAR ====================
  function abrirEliminar(item) {
    setMembresiaEliminar(item);
    setMostrarModalEliminar(true);
  }

  async function confirmarEliminar() {
    const { error } = await supabase
      .from("membresias_clientes")
      .delete()
      .eq("id", membresiaEliminar.id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    setMostrarModalEliminar(false);
    setMembresiaEliminar(null);
    fetchMembresiasClientes();
  }

  // ==================== GUARDAR NUEVA MEMBRESÍA ====================
  const handleMembresiaChange = (e) => {
    const membresiaId = e.target.value;
    const membresiaSeleccionada = membresias.find(
      (m) => m.id_membresia === Number(membresiaId)
    );

    let fechaVenc = "";
    if (membresiaSeleccionada?.duracion_dias) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + membresiaSeleccionada.duracion_dias);
      fechaVenc = fecha.toISOString().split("T")[0];
    }

    setNuevaMembresia((prev) => ({
      ...prev,
      membresia_id: membresiaId,
      fecha_vencimiento: fechaVenc,
    }));
  };

  async function guardarMembresia() {
    if (!nuevaMembresia.cliente_id || !nuevaMembresia.membresia_id || !nuevaMembresia.fecha_vencimiento) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const { error } = await supabase
      .from("membresias_clientes")
      .insert([nuevaMembresia]);

    if (error) {
      alert("Error al guardar: " + error.message);
      return;
    }

    setMostrarModal(false);
    resetFormulario();
    fetchMembresiasClientes();
    setMostrarExito(true);
    setTimeout(() => setMostrarExito(false), 2500);
  }

  function resetFormulario() {
    setNuevaMembresia({
      cliente_id: "",
      membresia_id: "",
      fecha_registro: new Date().toISOString().split("T")[0],
      fecha_vencimiento: "",
      estado: "Activa",
    });
  }

  // ==================== FUNCIONES AUXILIARES ====================
  function calcularDiasRestantes(fechaVencimiento) {
    if (!fechaVencimiento) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const venc = new Date(fechaVencimiento);
    const diff = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getEstadoBadge(estado, fechaVencimiento) {
    const dias = calcularDiasRestantes(fechaVencimiento);
    const estadoReal = dias !== null && dias < 0 ? "Vencida" : estado;

    const estilos = {
      Activa:    { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
      Vencida:   { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
      Pendiente: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
      Cancelada: { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
    };

    const estilo = estilos[estadoReal] || estilos.Cancelada;

    return (
      <span style={{
        backgroundColor: estilo.bg,
        color: estilo.color,
        border: `1px solid ${estilo.border}`,
        padding: "5px 12px",
        borderRadius: "9999px",
        fontSize: "13px",
        fontWeight: 600,
      }}>
        {estadoReal}
      </span>
    );
  }

 // ==================== BOTONES DE ACCIÓN ====================
function BotonesAccion({ item }) {
  return (
    <div className="text-center">

      {/* EDITAR */}
      <Button
        variant="warning"
        size="sm"
        className="me-2"
        title="Editar"
        onClick={() => abrirEditar(item)}
      >
        <i className="bi bi-pencil-square"></i>
      </Button>

      {/* ELIMINAR */}
      <Button
        variant="danger"
        size="sm"
        title="Eliminar"
        onClick={() => abrirEliminar(item)}
      >
        <i className="bi bi-trash"></i>
      </Button>

    </div>
  );
}

  // ==================== TARJETA MÓVIL ====================
  function TarjetaMembresia({ item }) {
    const dias = calcularDiasRestantes(item.fecha_vencimiento);
    const estadoReal =
      dias !== null && dias < 0 && item.estado !== "Cancelada"
        ? "Vencida"
        : item.estado;

    const iconoColor = {
      Activa:    "#0d6efd",
      Vencida:   "#dc3545",
      Pendiente: "#ffc107",
      Cancelada: "#6c757d",
    };

    return (
      <Col xs={12} sm={6} className="mb-3">
        <Card className="h-100 shadow-sm border-0">
          <Card.Body>

            <div className="text-center mb-3">
              <i className="bi bi-person-badge-fill" style={{
                fontSize: "4rem",
                color: iconoColor[estadoReal] || "#0d6efd",
              }}></i>
            </div>

            <Card.Title className="text-center fw-bold mb-3">
              {item.clientes?.nombres} {item.clientes?.apellidos}
            </Card.Title>

            <hr />

            <p className="mb-2">
              <strong>Correo:</strong>{" "}
              <span className="text-muted">{item.clientes?.correo || "—"}</span>
            </p>

            <p className="mb-2">
              <strong>Membresía:</strong>{" "}
              {item.membresias?.nombre || "—"}
            </p>

            <p className="mb-2">
              <strong>Días:</strong>{" "}
              {dias === null ? "—" : dias < 0 ? (
                <Badge bg="danger">Vencida</Badge>
              ) : dias <= 7 ? (
                <Badge bg="warning" text="dark">{dias} días</Badge>
              ) : (
                <Badge bg="success">{dias} días</Badge>
              )}
            </p>

            <p className="mb-0">
              <strong>Estado:</strong>{" "}
              {getEstadoBadge(estadoReal, item.fecha_vencimiento)}
            </p>

            <hr />

            <BotonesAccion item={item} />

          </Card.Body>
        </Card>
      </Col>
    );
  }

  // ==================== FILTRADO ====================
  const datosFiltrados = membresiasClientes.filter((item) => {
    const nombreCompleto =
      `${item.clientes?.nombres ?? ""} ${item.clientes?.apellidos ?? ""}`.toLowerCase();
    const tipoMembresia = (item.membresias?.nombre ?? "").toLowerCase();

    const coincideBusqueda =
      nombreCompleto.includes(busqueda.toLowerCase()) ||
      tipoMembresia.includes(busqueda.toLowerCase());

    const dias = calcularDiasRestantes(item.fecha_vencimiento);
    const estadoReal = dias !== null && dias < 0 ? "Vencida" : item.estado;

    const coincideEstado =
      filtroEstado === "Todos" || estadoReal === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  // ==================== RENDER ====================
  return (
    <div className="container-fluid py-4">

      {/* Encabezado */}
      <div className="mb-4">
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
          👥 Membresías de Clientes
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
          Gestiona las membresías de tus clientes
        </p>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="🔍 Buscar por cliente o membresía..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            width: esMobile ? "100%" : "320px",
            fontSize: "14px",
          }}
        />

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Todos", "Activa", "Vencida", "Pendiente", "Cancelada"].map((est) => (
            <Button
              key={est}
              onClick={() => setFiltroEstado(est)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: `1px solid ${filtroEstado === est ? "#3b82f6" : "#cbd5e1"}`,
                backgroundColor: filtroEstado === est ? "#3b82f6" : "#fff",
                color: filtroEstado === est ? "#fff" : "#374151",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {est}
            </Button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Membresía
          </Button>
          <button
            onClick={fetchMembresiasClientes}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando membresías...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : esMobile ? (
        // ==================== VISTA MÓVIL: TARJETAS ====================
        <Row>
          {datosFiltrados.length === 0 ? (
            <Col xs={12}>
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                <p style={{ fontSize: "15px" }}>No hay membresías registradas.</p>
              </div>
            </Col>
          ) : (
            datosFiltrados.map((item) => (
              <TarjetaMembresia key={item.id} item={item} />
            ))
          )}
        </Row>
      ) : (
        // ==================== VISTA DESKTOP: TABLA ====================
        <Table striped bordered hover responsive className="align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Membresía</th>
              <th>Precio</th>
              <th>Registro</th>
              <th>Vencimiento</th>
              <th>Días</th>
              <th>Estado</th>
              <th className="text-center" style={{ width: "150px" }}>
  Acciones
</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-muted">
                  No hay membresías registradas.
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => {
                const dias = calcularDiasRestantes(item.fecha_vencimiento);
                return (
                  <tr key={item.id}>
                    <td><strong>#{item.id}</strong></td>
                    <td>{item.clientes?.nombres} {item.clientes?.apellidos}</td>
                    <td>{item.clientes?.correo}</td>
                    <td><strong>{item.membresias?.nombre}</strong></td>
                    <td>${Number(item.membresias?.precio || 0).toFixed(2)}</td>
                    <td>{formatearFecha(item.fecha_registro)}</td>
                    <td>{formatearFecha(item.fecha_vencimiento)}</td>
                    <td>
                      {dias === null ? "—" : dias < 0 ? (
                        <Badge bg="danger">Vencida</Badge>
                      ) : dias <= 7 ? (
                        <Badge bg="warning" text="dark">{dias} días</Badge>
                      ) : (
                        <Badge bg="success">{dias} días</Badge>
                      )}
                    </td>
                    <td>{getEstadoBadge(item.estado, item.fecha_vencimiento)}</td>
                   <td className="text-center">
  <BotonesAccion item={item} />
</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}

      {/* ==================== MODAL NUEVA MEMBRESÍA ==================== */}
      <Modal show={mostrarModal} onHide={() => { setMostrarModal(false); resetFormulario(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Membresía</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              value={nuevaMembresia.cliente_id}
              onChange={(e) => setNuevaMembresia({ ...nuevaMembresia, cliente_id: e.target.value })}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombres} {cliente.apellidos}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Membresía</Form.Label>
            <Form.Select value={nuevaMembresia.membresia_id} onChange={handleMembresiaChange}>
              <option value="">Seleccione una membresía</option>
              {membresias.map((m) => (
                <option key={m.id_membresia} value={m.id_membresia}>
                  {m.nombre} - ${m.precio}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              value={nuevaMembresia.fecha_vencimiento}
              onChange={(e) => setNuevaMembresia({ ...nuevaMembresia, fecha_vencimiento: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setMostrarModal(false); resetFormulario(); }}>
            Cancelar
          </Button>
          <Button variant="success" onClick={guardarMembresia}>
            Guardar Membresía
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================== MODAL EDITAR ==================== */}
      <Modal show={mostrarModalEditar} onHide={() => { setMostrarModalEditar(false); setMembresiaEditando(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Editar Membresía</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {membresiaEditando && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Membresía</Form.Label>
                <Form.Select
                  value={membresiaEditando.membresia_id}
                  onChange={(e) => {
                    const memId = e.target.value;
                    const memSel = membresias.find((m) => m.id_membresia === Number(memId));
                    let fechaVenc = membresiaEditando.fecha_vencimiento;
                    if (memSel?.duracion_dias) {
                      const fecha = new Date();
                      fecha.setDate(fecha.getDate() + memSel.duracion_dias);
                      fechaVenc = fecha.toISOString().split("T")[0];
                    }
                    setMembresiaEditando({ ...membresiaEditando, membresia_id: memId, fecha_vencimiento: fechaVenc });
                  }}
                >
                  {membresias.map((m) => (
                    <option key={m.id_membresia} value={m.id_membresia}>
                      {m.nombre} - ${m.precio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Vencimiento</Form.Label>
                <Form.Control
                  type="date"
                  value={membresiaEditando.fecha_vencimiento}
                  onChange={(e) => setMembresiaEditando({ ...membresiaEditando, fecha_vencimiento: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={membresiaEditando.estado}
                  onChange={(e) => setMembresiaEditando({ ...membresiaEditando, estado: e.target.value })}
                >
                  <option value="Activa">Activa</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Vencida">Vencida</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setMostrarModalEditar(false); setMembresiaEditando(null); }}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={guardarEdicion}>
            <i className="bi bi-save me-1"></i> Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================== MODAL CONFIRMAR ELIMINAR ==================== */}
      <Modal show={mostrarModalEliminar} onHide={() => { setMostrarModalEliminar(false); setMembresiaEliminar(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>🗑️ Eliminar Membresía</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {membresiaEliminar && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
                <i className="bi bi-trash" style={{ fontSize: "28px", color: "#dc2626" }}></i>
              </div>
              <h6 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                ¿Eliminar esta membresía?
              </h6>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                <strong>{membresiaEliminar.clientes?.nombres} {membresiaEliminar.clientes?.apellidos}</strong>
                {" — "}{membresiaEliminar.membresias?.nombre}
              </p>
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", gap: "12px" }}>
          <Button variant="secondary" onClick={() => { setMostrarModalEliminar(false); setMembresiaEliminar(null); }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            <i className="bi bi-trash me-1"></i> Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================== ANIMACIÓN ÉXITO ==================== */}
      {mostrarExito && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2.5rem 3rem",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            animation: "popIn 0.3s ease",
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.2rem",
              animation: "scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: "0 8px 25px rgba(34,197,94,0.4)",
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <polyline
                  points="8,20 16,30 32,12"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: "drawCheck 0.4s ease 0.2s both" }}
                />
              </svg>
            </div>
            <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
              ¡Membresía guardada!
            </h5>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              El registro se actualizó correctamente.
            </p>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes popIn {
              from { transform: scale(0.7); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0); }
              to { transform: scale(1); }
            }
            @keyframes drawCheck {
              from { stroke-dashoffset: 50; stroke-dasharray: 50; }
              to { stroke-dashoffset: 0; stroke-dasharray: 50; }
            }
          `}</style>
        </div>
      )}

    </div>
  );
}