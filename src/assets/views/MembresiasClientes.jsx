import { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Spinner
} from "react-bootstrap";

export default function MembresiasClientes() {
  const [membresiasClientes, setMembresiasClientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevaMembresia, setNuevaMembresia] = useState({
    cliente_id: "",
    membresia_id: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    fecha_vencimiento: "",
    estado: "Activa"
  });

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

      // Actualización automática de estado a "Vencida"
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
    const actualizaciones = [];
    const resultado = data.map(item => {
      const dias = calcularDiasRestantes(item.fecha_vencimiento);
      if (dias !== null && dias < 0 && item.estado !== "Vencida" && item.estado !== "Cancelada") {
        actualizaciones.push({ id: item.id, estado: "Vencida" });
        return { ...item, estado: "Vencida" };
      }
      return item;
    });

    if (actualizaciones.length > 0) {
      await supabase.from("membresias_clientes").upsert(actualizaciones);
    }

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

  // ==================== GUARDAR NUEVA MEMBRESÍA ====================
  const handleMembresiaChange = (e) => {
    const membresiaId = e.target.value;
    const membresiaSeleccionada = membresias.find(m => m.id_membresia === Number(membresiaId));

    let fechaVenc = "";
    if (membresiaSeleccionada?.duracion_dias) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + membresiaSeleccionada.duracion_dias);
      fechaVenc = fecha.toISOString().split("T")[0];
    }

    setNuevaMembresia(prev => ({
      ...prev,
      membresia_id: membresiaId,
      fecha_vencimiento: fechaVenc
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

    alert("✅ Membresía registrada correctamente");
    setMostrarModal(false);
    resetFormulario();
    fetchMembresiasClientes();
  }

  function resetFormulario() {
    setNuevaMembresia({
      cliente_id: "",
      membresia_id: "",
      fecha_registro: new Date().toISOString().split("T")[0],
      fecha_vencimiento: "",
      estado: "Activa"
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
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  }

  function getEstadoBadge(estado, fechaVencimiento) {
    const dias = calcularDiasRestantes(fechaVencimiento);
    const estadoReal = dias !== null && dias < 0 ? "Vencida" : estado;

    const estilos = {
      Activa: { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
      Vencida: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
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

  // ==================== FILTRADO ====================
  const datosFiltrados = membresiasClientes.filter((item) => {
    const nombreCompleto = `${item.clientes?.nombres ?? ""} ${item.clientes?.apellidos ?? ""}`.toLowerCase();
    const tipoMembresia = (item.membresias?.nombre ?? "").toLowerCase();

    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase()) ||
                            tipoMembresia.includes(busqueda.toLowerCase());

    const dias = calcularDiasRestantes(item.fecha_vencimiento);
    const estadoReal = dias !== null && dias < 0 ? "Vencida" : item.estado;

    const coincideEstado = filtroEstado === "Todos" || estadoReal === filtroEstado;

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
          style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", width: "320px", fontSize: "14px" }}
        />

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

  <Button
  variant="success"
  onClick={() => setMostrarModal(true)}
>
  <i className="bi bi-plus-circle me-2"></i>
  Nueva Membresía
</Button>

        <button 
          onClick={fetchMembresiasClientes} 
          style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff" }}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
  <div className="text-center py-5">
    <Spinner animation="border" variant="primary" />
    <p className="mt-3">Cargando membresías...</p>
  </div>
) : error ? (
  <div className="alert alert-danger">
    {error}
  </div>
) : (
  <Table
    striped
    bordered
    hover
    responsive
    className="align-middle shadow-sm"
  >
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
      </tr>
    </thead>

    <tbody>
      {datosFiltrados.length === 0 ? (
        <tr>
          <td colSpan="9" className="text-center py-4 text-muted">
            No hay membresías registradas.
          </td>
          <td className="text-center">

  <Button
    variant="warning"
    size="sm"
    className="me-2"
  >
    <i className="bi bi-pencil-square"></i>
  </Button>

  <Button
    variant="danger"
    size="sm"
  >
    <i className="bi bi-trash"></i>
  </Button>

</td>
        </tr>
      ) : (
        datosFiltrados.map((item) => {
          const dias = calcularDiasRestantes(item.fecha_vencimiento);

          return (
            <tr key={item.id}>
              <td>
                <strong>#{item.id}</strong>
              </td>

              <td>
                {item.clientes?.nombres} {item.clientes?.apellidos}
              </td>

              <td>{item.clientes?.correo}</td>

              <td>
                <strong>
                  {item.membresias?.nombre}
                </strong>
              </td>

              <td>
                ${Number(item.membresias?.precio || 0).toFixed(2)}
              </td>

              <td>
                {formatearFecha(item.fecha_registro)}
              </td>

              <td>
                {formatearFecha(item.fecha_vencimiento)}
              </td>

              <td>
                {dias === null ? (
                  "-"
                ) : dias < 0 ? (
                  <Badge bg="danger">
                    Vencida
                  </Badge>
                ) : dias <= 7 ? (
                  <Badge bg="warning">
                    {dias} días
                  </Badge>
                ) : (
                  <Badge bg="success">
                    {dias} días
                  </Badge>
                )}
              </td>

              <td>
          <Badge
  bg={
    item.estado === "Activa"
      ? "success"
      : item.estado === "Vencida"
      ? "danger"
      : item.estado === "Pendiente"
      ? "warning"
      : "secondary"
  }
>
                  {item.estado}
                </Badge>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </Table>
)}

      {/* Modal */}
 <Modal
  show={mostrarModal}
  onHide={() => {
    setMostrarModal(false);
    resetFormulario();
  }}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>
      Nueva Membresía
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>

    <Form.Group className="mb-3">
      <Form.Label>Cliente</Form.Label>
      <Form.Select
        value={nuevaMembresia.cliente_id}
        onChange={(e) =>
          setNuevaMembresia({
            ...nuevaMembresia,
            cliente_id: e.target.value
          })
        }
      >
        <option value="">
          Seleccione un cliente
        </option>

        {clientes.map((cliente) => (
          <option
            key={cliente.id_cliente}
            value={cliente.id_cliente}
          >
            {cliente.nombres} {cliente.apellidos}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Membresía</Form.Label>

      <Form.Select
        value={nuevaMembresia.membresia_id}
        onChange={handleMembresiaChange}
      >
        <option value="">
          Seleccione una membresía
        </option>

        {membresias.map((m) => (
          <option
            key={m.id_membresia}
            value={m.id_membresia}
          >
            {m.nombre} - ${m.precio}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group>
      <Form.Label>
        Fecha de Vencimiento
      </Form.Label>

      <Form.Control
        type="date"
        value={nuevaMembresia.fecha_vencimiento}
        onChange={(e) =>
          setNuevaMembresia({
            ...nuevaMembresia,
            fecha_vencimiento: e.target.value
          })
        }
      />
    </Form.Group>

  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => {
        setMostrarModal(false);
        resetFormulario();
      }}
    >
      Cancelar
    </Button>

    <Button
      variant="success"
      onClick={guardarMembresia}
    >
      Guardar Membresía
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}