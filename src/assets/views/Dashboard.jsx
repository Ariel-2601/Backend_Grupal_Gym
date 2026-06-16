import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// ─── Helpers de fecha ────────────────────────────────────────────────────────
const hoyISO = () => new Date().toISOString().split("T")[0];
const inicioMes = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
};
const finMes = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
};

// ─── Paleta VIBRANTE y VISIBLE ────────────────────────────────────────────
const theme = {
    bg: "#F0F4F8",
    bgCard: "#FFFFFF",
    bgElevated: "#E2E8F0",
    bgGlass: "rgba(255, 255, 255, 0.9)",
    primary: "#4F46E5",
    primaryLight: "#6366F1",
    secondary: "#EC4899",
    accent1: "#0EA5E9",
    accent2: "#8B5CF6",
    accent3: "#F59E0B",
    accent4: "#10B981",
    accent5: "#EF4444",
    accent6: "#DC2626",
    accent7: "#F97316",
    text: "#0F172A",
    textMuted: "#475569",
    textSubtle: "#64748B",
    border: "rgba(148, 163, 184, 0.3)",
    shadowSoft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    shadowMedium: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    shadowAlert: "0 4px 20px rgba(239, 68, 68, 0.15)",
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)",
        padding: "32px",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: theme.text,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        padding: "0 4px",
    },
    title: {
        fontSize: "32px",
        fontWeight: 800,
        color: theme.text,
        margin: 0,
        letterSpacing: "-0.02em",
    },
    subtitle: {
        fontSize: "14px",
        color: theme.textMuted,
        marginTop: "6px",
        fontWeight: 400,
    },
    dateBadge: {
        background: theme.bgGlass,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "12px 24px",
        borderRadius: "16px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.border,
        color: theme.textMuted,
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: theme.shadowSoft,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    sectionLabel: {
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: theme.textSubtle,
        marginBottom: "16px",
        marginTop: "8px",
        paddingLeft: "4px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "28px",
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "28px",
    },
    card: {
        background: theme.bgCard,
        borderRadius: "16px",
        padding: "28px",
        boxShadow: theme.shadowSoft,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.border,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
    },
    cardHover: {
        transform: "translateY(-3px)",
        boxShadow: theme.shadowMedium,
        borderColor: "rgba(209, 213, 219, 1)",
    },
    cardGlow: (color) => ({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        borderRadius: "16px 16px 0 0",
    }),
    cardLabel: {
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: theme.textMuted,
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    cardValue: (color) => ({
        fontSize: "36px",
        fontWeight: 800,
        color: color || theme.text,
        lineHeight: 1,
        letterSpacing: "-0.03em",
    }),
    cardSub: {
        fontSize: "13px",
        color: theme.textMuted,
        marginTop: "10px",
        fontWeight: 400,
    },
    cardIcon: (color) => ({
        position: "absolute",
        top: "24px",
        right: "24px",
        fontSize: "32px",
        opacity: 0.15,
        color: color,
    }),
    heroCard: {
        background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
        borderRadius: "20px",
        padding: "32px",
        color: theme.text,
        boxShadow: `0 4px 20px ${theme.primary}25`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `${theme.primary}30`,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    heroCardGlow: {
        position: "absolute",
        top: "-100px",
        right: "-100px",
        width: "300px",
        height: "300px",
        background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`,
        pointerEvents: "none",
    },
    heroLabel: {
        fontSize: "13px",
        fontWeight: 600,
        color: theme.primary,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
    },
    heroValue: {
        fontSize: "44px",
        marginTop: "12px",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        color: theme.text,
    },
    heroSub: {
        fontSize: "14px",
        color: theme.textMuted,
        marginTop: "8px",
    },
    pill: (color) => ({
        background: `${color}15`,
        color: color,
        fontSize: "12px",
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: "20px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `${color}30`,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
    }),
    dot: (color) => ({
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 8px ${color}60`,
    }),
    rankRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: `1px solid ${theme.border}`,
    },
    rankBar: (pct, color) => ({
        height: "8px",
        borderRadius: "4px",
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        width: `${pct}%`,
        transition: "width 1s cubic-bezier(.4,0,.2,1)",
        marginTop: "6px",
    }),
    divider: {
        borderColor: theme.border,
        margin: "24px 0",
    },
    modalHeader: {
        background: theme.bgCard,
        border: "none",
        borderBottom: `1px solid ${theme.border}`,
        color: theme.text,
        padding: "24px",
    },
    modalBody: {
        background: theme.bg,
        maxHeight: "75vh",
        overflowY: "auto",
        padding: "28px",
    },
    modalFooter: {
        background: theme.bgCard,
        border: "none",
        borderTop: `1px solid ${theme.border}`,
        padding: "20px 24px",
    },
    btnPrimary: {
        background: theme.primary,
        border: "none",
        fontWeight: 700,
        padding: "10px 24px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: `0 4px 15px ${theme.primary}44`,
        transition: "all 0.2s ease",
    },
    btnSecondary: {
        background: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.border,
        color: theme.textMuted,
        fontWeight: 600,
        padding: "10px 24px",
        borderRadius: "12px",
        transition: "all 0.2s ease",
    },
    ingresoCard: {
        background: theme.bgCard,
        borderRadius: "16px",
        padding: "24px",
        boxShadow: theme.shadowSoft,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.border,
        marginBottom: "16px",
    },
    ingresoLabel: {
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: theme.textMuted,
        marginBottom: "8px",
    },
    ingresoValue: {
        fontSize: "28px",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-0.03em",
    },
    ingresoSub: {
        fontSize: "13px",
        color: theme.textMuted,
        marginTop: "8px",
    },
    alertCard: {
        background: theme.bgCard,
        borderRadius: "16px",
        padding: "24px",
        boxShadow: theme.shadowSoft,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `${theme.accent6}30`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
    },
    alertCardHover: {
        transform: "translateY(-3px)",
        boxShadow: theme.shadowAlert,
        borderColor: `${theme.accent6}60`,
    },
    alertCardGlow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${theme.accent6}, ${theme.accent7})`,
        borderRadius: "16px 16px 0 0",
    },
    alertBadge: {
        position: "absolute",
        top: "16px",
        right: "16px",
        background: `${theme.accent6}15`,
        color: theme.accent6,
        fontSize: "11px",
        fontWeight: 800,
        padding: "4px 10px",
        borderRadius: "12px",
        border: `1px solid ${theme.accent6}30`,
    },
    alertItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: `1px solid ${theme.border}`,
        transition: "background 0.2s ease",
    },
    alertItemLast: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "none",
    },
    alertItemName: {
        fontSize: "14px",
        fontWeight: 600,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    alertItemDetail: {
        fontSize: "12px",
        color: theme.textMuted,
        marginTop: "2px",
    },
    alertItemBadge: (color) => ({
        background: `${color}15`,
        color: color,
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "10px",
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
    }),
    alertEmpty: {
        textAlign: "center",
        padding: "24px",
        color: theme.textMuted,
        fontSize: "14px",
    },
    alertSectionTitle: {
        fontSize: "13px",
        fontWeight: 700,
        color: theme.text,
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    powerBiContainer: {
        background: theme.bgCard,
        borderRadius: "16px",
        boxShadow: theme.shadowSoft,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.border,
        overflow: "hidden",
        marginBottom: "28px",
    },
    powerBiHeader: {
        padding: "20px 24px",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
    },
    powerBiTitle: {
        fontSize: "16px",
        fontWeight: 700,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    powerBiBadge: {
        background: `${theme.primary}15`,
        color: theme.primary,
        fontSize: "11px",
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: "20px",
        border: `1px solid ${theme.primary}30`,
    },
    powerBiFooter: {
        padding: "12px 24px",
        borderTop: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
    },
    powerBiFooterText: {
        fontSize: "12px",
        color: theme.textSubtle,
    },
    powerBiButton: {
        background: theme.primary,
        border: "none",
        fontWeight: 600,
        padding: "6px 16px",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    paginationContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        marginTop: "32px",
        marginBottom: "32px",
        padding: "16px",
        background: theme.bgCard,
        borderRadius: "16px",
        boxShadow: theme.shadowSoft,
        border: `1px solid ${theme.border}`,
        position: "sticky",
        bottom: "20px",
        zIndex: 100,
    },
    paginationButton: {
        padding: "10px 20px",
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        background: theme.bgCard,
        color: theme.text,
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    paginationButtonDisabled: {
        background: theme.bgElevated,
        color: theme.textSubtle,
        cursor: "not-allowed",
    },
    paginationNumber: {
        minWidth: "40px",
        height: "40px",
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        background: theme.bgCard,
        color: theme.textMuted,
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 700,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "0 12px",
    },
    paginationNumberActive: {
        border: `1px solid ${theme.primary}`,
        background: theme.primary,
        color: "#fff",
    },
    paginationInfo: {
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "13px",
        color: theme.textSubtle,
        fontWeight: 500,
    },
};

const CatalogoModal = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 9;

    const obtenerProductos = async () => {
        setCargando(true);
        const { data, error } = await supabase.from("productos").select("*");
        if (error) {
            console.error("Error cargando productos:", error);
        } else {
            setProductos(data || []);
        }
        setCargando(false);
    };

    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModalProducto(true);
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    const productosFiltrados = productos.filter((producto) => {
        const textoBusqueda = busqueda.toLowerCase().trim();
        if (!textoBusqueda) return true;
        const nombre = (producto.nombre_producto || "").toLowerCase();
        const categoria = (producto.categoria_producto || "").toLowerCase();
        return nombre.includes(textoBusqueda) || categoria.includes(textoBusqueda);
    });

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indiceInicio = (paginaActual - 1) * productosPorPagina;
    const indiceFin = indiceInicio + productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    if (cargando) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: `4px solid ${theme.border}`,
                    borderTop: `4px solid ${theme.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto"
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ color: theme.textMuted, marginTop: "16px" }}>Cargando productos...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
                    <span style={{ 
                        position: "absolute", 
                        left: "16px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        fontSize: "18px",
                        color: "#94a3b8",
                        pointerEvents: "none"
                    }}>
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
                        style={{
                            width: "100%",
                            padding: "12px 16px 12px 48px",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontSize: "15px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            transition: "all 0.2s ease",
                            outline: "none",
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
                            onClick={() => {
                                setBusqueda("");
                                setPaginaActual(1);
                            }}
                            style={{
                                position: "absolute",
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

            {busqueda && (
                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "16px", fontSize: "14px" }}>
                    {productosFiltrados.length} {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"} 
                    {productosFiltrados.length !== productos.length && ` de ${productos.length}`}
                </p>
            )}

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
                maxHeight: "55vh",
                overflowY: "auto",
                padding: "8px"
            }}>
                {productosPaginados.map((producto) => (
                    <div
                        key={producto.id_producto}
                        style={{
                            background: theme.bgCard,
                            borderRadius: "16px",
                            boxShadow: theme.shadowSoft,
                            border: `1px solid ${theme.border}`,
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onClick={() => verProducto(producto)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                            e.currentTarget.style.boxShadow = theme.shadowMedium;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = theme.shadowSoft;
                        }}
                    >
                        <div style={{
                            height: "200px",
                            background: "#f8f9fa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            <img
                                src={producto.imagen || "https://via.placeholder.com/300x250?text=Sin+Imagen"}
                                alt={producto.nombre_producto}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    padding: "12px"
                                }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x250?text=Sin+Imagen";
                                }}
                            />
                        </div>
                        <div style={{ padding: "20px" }}>
                            <span style={{
                                ...styles.pill(theme.primary),
                                fontSize: "11px",
                                marginBottom: "10px",
                                display: "inline-block"
                            }}>
                                {producto.categoria_producto}
                            </span>
                            <h3 style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                color: theme.text,
                                margin: "8px 0",
                                lineHeight: 1.3
                            }}>
                                {producto.nombre_producto}
                            </h3>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "12px"
                            }}>
                                <span style={{
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: theme.accent4
                                }}>
                                    ${producto.precio}
                                </span>
                                <span style={{
                                    fontSize: "13px",
                                    color: producto.stock < 3 ? theme.accent6 : theme.textMuted,
                                    fontWeight: 600
                                }}>
                                    {producto.stock === 0 ? "❌ Agotado" : 
                                     producto.stock < 3 ? `⚠️ ${producto.stock} unid.` : 
                                     `✅ ${producto.stock} unid.`}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {productosPaginados.length === 0 && !cargando && (
                    <div style={{ 
                        gridColumn: "1 / -1", 
                        textAlign: "center", 
                        padding: "40px",
                        background: theme.bgCard,
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                        <h4 style={{ color: "#64748b", fontWeight: 600, marginBottom: "8px" }}>
                            No se encontraron productos
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                            Intenta con otro término de búsqueda
                        </p>
                    </div>
                )}
            </div>

            {totalPaginas > 1 && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "24px",
                    padding: "16px 0",
                }}>
                    <button
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.border}`,
                            background: paginaActual === 1 ? theme.bgElevated : theme.bgCard,
                            color: paginaActual === 1 ? theme.textSubtle : theme.text,
                            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                        }}
                    >
                        ← Anterior
                    </button>

                    <div style={{ display: "flex", gap: "6px" }}>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => cambiarPagina(num)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    border: `1px solid ${num === paginaActual ? theme.primary : theme.border}`,
                                    background: num === paginaActual ? theme.primary : theme.bgCard,
                                    color: num === paginaActual ? "#fff" : theme.textMuted,
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.border}`,
                            background: paginaActual === totalPaginas ? theme.bgElevated : theme.bgCard,
                            color: paginaActual === totalPaginas ? theme.textSubtle : theme.text,
                            cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                        }}
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            <div style={{ textAlign: "center", marginTop: "8px" }}>
                <span style={{ fontSize: "12px", color: theme.textSubtle }}>
                    Página {paginaActual} de {totalPaginas} · Mostrando {productosPaginados.length} de {productosFiltrados.length} productos
                </span>
            </div>

            <Modal show={mostrarModalProducto} onHide={() => setMostrarModalProducto(false)} centered size="lg">
                {productoSeleccionado && (
                    <>
                        <Modal.Header closeButton style={styles.modalHeader}>
                            <Modal.Title style={{ fontWeight: 800, color: theme.text }}>
                                {productoSeleccionado.nombre_producto}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={styles.modalBody}>
                            <div style={{
                                background: "#f8f9fa",
                                borderRadius: "16px",
                                overflow: "hidden",
                                marginBottom: "20px"
                            }}>
                                <img
                                    src={productoSeleccionado.imagen || "https://via.placeholder.com/600x400?text=Sin+Imagen"}
                                    alt={productoSeleccionado.nombre_producto}
                                    style={{
                                        width: "100%",
                                        height: "350px",
                                        objectFit: "contain",
                                        padding: "20px"
                                    }}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/600x400?text=Sin+Imagen";
                                    }}
                                />
                            </div>
                            <span style={{
                                ...styles.pill(theme.primary),
                                fontSize: "12px",
                                marginBottom: "16px",
                                display: "inline-block"
                            }}>
                                {productoSeleccionado.categoria_producto}
                            </span>
                            <h2 style={{
                                fontSize: "32px",
                                fontWeight: 800,
                                color: theme.accent4,
                                margin: "12px 0"
                            }}>
                                ${productoSeleccionado.precio}
                            </h2>
                            <hr style={styles.divider} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div style={{
                                    background: theme.bgCard,
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{...styles.ingresoLabel, marginBottom: "4px"}}>Stock disponible</div>
                                    <div style={{
                                        fontSize: "24px",
                                        fontWeight: 800,
                                        color: productoSeleccionado.stock < 3 ? theme.accent6 : theme.accent4
                                    }}>
                                        {productoSeleccionado.stock} unidades
                                    </div>
                                </div>
                                <div style={{
                                    background: theme.bgCard,
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <div style={{...styles.ingresoLabel, marginBottom: "4px"}}>Categoría</div>
                                    <div style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        color: theme.text
                                    }}>
                                        {productoSeleccionado.categoria_producto}
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer style={styles.modalFooter}>
                            <Button size="sm" style={styles.btnSecondary} onClick={() => setMostrarModalProducto(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState({
        totalClientes: 0,
        totalProductos: 0,
        asistenciasHoy: 0,
        ventasHoy: 0,
        ventasHoyTotal: 0,
        productosVendidosHoy: 0,
        ingresosMes: 0,
        ingresosProductosMes: 0,
        ingresosProductosMesC$: 0,
        ingresosMembresiasMes: 0,
        clientesActivos: 0,
        horarioPico: "Sin datos",
        frecuenciaAsistencia: 0,
        diaMayorConcurrencia: "Sin datos",
        productoMasVendido: "Sin datos",
        productosMasVendidos: [],
        ventasMes: [],
        membresiasMes: [],
        clientesPorVencer: [],
        productosStockBajo: [],
    });
    const [cargando, setCargando] = useState(true);
    const [mostrarKPI, setMostrarKPI] = useState(false);
    const [mostrarIngresos, setMostrarIngresos] = useState(false);
    const [mostrarAlertas, setMostrarAlertas] = useState(false);
    const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    
    const [paginaDashboard, setPaginaDashboard] = useState(1);

    const [tasaCambio, setTasaCambio] = useState(36.5);
    const [editandoTasa, setEditandoTasa] = useState(false);

    const hoy = hoyISO();
    const mesInicio = inicioMes();
    const mesFin = finMes();

    const cambiarPaginaDashboard = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginasDashboard) {
            setPaginaDashboard(nuevaPagina);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const cargarDashboard = async () => {
        try {
            setCargando(true);
            console.log("📅 Fechas de consulta:", { hoy, mesInicio, mesFin });

            const { count: totalClientes } = await supabase
                .from("clientes")
                .select("*", { count: "exact", head: true });

            const { count: clientesActivos } = await supabase
                .from("clientes")
                .select("*", { count: "exact", head: true })
                .eq("estado", "Activo");

            const { count: totalProductos } = await supabase
                .from("productos")
                .select("*", { count: "exact", head: true });

            const { count: asistenciasHoy } = await supabase
                .from("asistencias")
                .select("*", { count: "exact", head: true })
                .eq("fecha", hoy);

            console.log("🔍 Consultando ventas para fecha:", hoy);
            const { data: ventasHoyData, error: errorVentasHoy } = await supabase
                .from("ventas")
                .select("total, fecha_venta")
                .eq("fecha_venta", hoy);

            if (errorVentasHoy) {
                console.error("❌ Error ventas hoy:", errorVentasHoy);
            } else {
                console.log("✅ Ventas hoy:", ventasHoyData);
            }

            const ventasHoy = ventasHoyData?.length || 0;
            const ventasHoyTotal = ventasHoyData?.reduce((acc, v) => acc + Number(v.total || 0), 0) || 0;

            const { data: ventasMes, error: errorVentasMes } = await supabase
                .from("ventas")
                .select("total, fecha_venta")
                .gte("fecha_venta", mesInicio)
                .lte("fecha_venta", mesFin);

            if (errorVentasMes) {
                console.error("❌ Error ventas mes:", errorVentasMes);
            } else {
                console.log("✅ Ventas mes:", ventasMes?.length, "registros");
            }

            const ingresosProductosMes = ventasMes?.reduce((acc, v) => acc + Number(v.total || 0), 0) || 0;
            const ingresosProductosMesC$ = ingresosProductosMes * tasaCambio;

            const { data: membresiasMes, error: errorMembresiasMes } = await supabase
                .from("membresias_clientes")
                .select(`
                    id,
                    fecha_registro,
                    membresias (precio)
                `)
                .gte("fecha_registro", mesInicio)
                .lte("fecha_registro", mesFin);

            if (errorMembresiasMes) {
                console.error("❌ Error membresías mes:", errorMembresiasMes);
            } else {
                console.log("✅ Membresías mes:", membresiasMes?.length, "registros");
            }

            const ingresosMembresiasMes = membresiasMes?.reduce((acc, m) => {
                return acc + Number(m.membresias?.precio || 0);
            }, 0) || 0;

            const ingresosMes = ingresosProductosMesC$ + ingresosMembresiasMes;

            console.log("💰 Ingresos:", {
                productosUSD: ingresosProductosMes,
                productosC$: ingresosProductosMesC$,
                membresiasC$: ingresosMembresiasMes,
                totalC$: ingresosMes,
                tasa: tasaCambio
            });

            const { data: asistenciasAll } = await supabase
                .from("asistencias")
                .select("fecha, hora_entrada");

            let horarioPico = "Sin datos";
            let diaMayorConcurrencia = "Sin datos";
            let frecuenciaAsistencia = 0;

            if (asistenciasAll && asistenciasAll.length > 0) {
                const conteoHoras = {};
                asistenciasAll.forEach(({ hora_entrada }) => {
                    if (!hora_entrada) return;
                    const h = hora_entrada.toString().split(":")[0];
                    conteoHoras[h] = (conteoHoras[h] || 0) + 1;
                });
                const [horaPico] = Object.entries(conteoHoras).sort((a, b) => b[1] - a[1])[0] || [];
                if (horaPico) {
                    const h = parseInt(horaPico);
                    horarioPico = `${String(h).padStart(2, "0")}:00 - ${String((h + 1) % 24).padStart(2, "0")}:00 hrs`;
                }

                const conteoDias = {};
                asistenciasAll.forEach(({ fecha }) => {
                    if (!fecha) return;
                    const nombre = new Date(fecha).toLocaleDateString("es-ES", { weekday: "long" });
                    conteoDias[nombre] = (conteoDias[nombre] || 0) + 1;
                });
                const [mejorDia] = Object.entries(conteoDias).sort((a, b) => b[1] - a[1])[0] || [];
                if (mejorDia) diaMayorConcurrencia = mejorDia;

                frecuenciaAsistencia = totalClientes > 0
                    ? (asistenciasAll.length / totalClientes).toFixed(1)
                    : 0;
            }

            console.log("🔍 Consultando ventas de hoy para detalles...");
            const { data: ventasHoyIds, error: errorIds } = await supabase
                .from("ventas")
                .select("id_venta")
                .eq("fecha_venta", hoy);

            if (errorIds) {
                console.error("❌ Error IDs ventas:", errorIds);
            }

            let productosVendidosHoy = 0;
            let productosMasVendidos = [];
            let productoMasVendido = "Sin datos";

            if (ventasHoyIds && ventasHoyIds.length > 0) {
                const ids = ventasHoyIds.map(v => v.id_venta);
                console.log("🔍 IDs de ventas hoy:", ids);

                const { data: detalleHoy, error: errorDetalle } = await supabase
                    .from("detalle_ventas")
                    .select("cantidad, productos(nombre_producto)")
                    .in("id_venta", ids);

                if (errorDetalle) {
                    console.error("❌ Error detalle hoy:", errorDetalle);
                } else {
                    console.log("✅ Detalle hoy:", detalleHoy);
                    productosVendidosHoy = detalleHoy?.reduce(
                        (acc, d) => acc + Number(d.cantidad || 0), 0
                    ) || 0;
                }
            }

            const { data: detalleVentas, error: errorDetalleAll } = await supabase
                .from("detalle_ventas")
                .select("cantidad, productos(nombre_producto)");

            if (errorDetalleAll) {
                console.error("❌ Error detalle todas:", errorDetalleAll);
            }

            if (detalleVentas && detalleVentas.length > 0) {
                const agrupado = {};
                detalleVentas.forEach(({ cantidad, productos }) => {
                    const nombre = productos?.nombre_producto || "Sin nombre";
                    agrupado[nombre] = (agrupado[nombre] || 0) + Number(cantidad || 0);
                });
                productosMasVendidos = Object.entries(agrupado)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8);
                if (productosMasVendidos.length > 0) {
                    productoMasVendido = productosMasVendidos[0][0];
                }
            }

            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() + 3);
            const fechaLimiteStr = fechaLimite.toISOString().split("T")[0];

            console.log("🔔 Buscando membresías por vencer antes de:", fechaLimiteStr);

            const { data: membresiasPorVencerData, error: errorMembresiasVencer } = await supabase
                .from("membresias_clientes")
                .select(`
                    id,
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
                .lte("fecha_vencimiento", fechaLimiteStr)
                .gte("fecha_vencimiento", hoy)
                .in("estado", ["Activa", "Pendiente"])
                .order("fecha_vencimiento", { ascending: true });

            if (errorMembresiasVencer) {
                console.error("❌ Error membresías por vencer:", errorMembresiasVencer);
            } else {
                console.log("✅ Membresías por vencer:", membresiasPorVencerData?.length || 0);
                console.log("📋 Datos:", membresiasPorVencerData);
            }

            const clientesPorVencer = (membresiasPorVencerData || []).map(mc => {
                const hoyDate = new Date();
                const hoyStr = hoyDate.toISOString().split("T")[0];
                const [anioHoy, mesHoy, diaHoy] = hoyStr.split("-").map(Number);
                const [anioVenc, mesVenc, diaVenc] = mc.fecha_vencimiento.split("-").map(Number);
                
                const fechaHoy = Date.UTC(anioHoy, mesHoy - 1, diaHoy);
                const fechaVenc = Date.UTC(anioVenc, mesVenc - 1, diaVenc);
                const diffMs = fechaVenc - fechaHoy;
                const diasRestantes = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                return {
                    id: mc.id,
                    nombre: `${mc.clientes?.nombres || ''} ${mc.clientes?.apellidos || ''}`.trim(),
                    correo: mc.clientes?.correo || 'N/A',
                    telefono: mc.clientes?.telefono || 'N/A',
                    membresia: mc.membresias?.nombre || 'Sin membresía',
                    precio: mc.membresias?.precio || 0,
                    fechaVencimiento: mc.fecha_vencimiento,
                    diasRestantes: diasRestantes,
                    estado: mc.estado,
                };
            }).filter(c => c.diasRestantes >= 0 && c.diasRestantes <= 3);

            console.log("📦 Buscando productos con stock bajo (< 3)...");

            const { data: productosStockBajoData, error: errorStockBajo } = await supabase
                .from("productos")
                .select(`
                    id_producto,
                    nombre_producto,
                    categoria_producto,
                    precio,
                    stock
                `)
                .lt("stock", 3)
                .gt("stock", 0)
                .order("stock", { ascending: true });

            if (errorStockBajo) {
                console.error("❌ Error productos stock bajo:", errorStockBajo);
            }

            const { data: productosAgotadosData, error: errorAgotados } = await supabase
                .from("productos")
                .select(`
                    id_producto,
                    nombre_producto,
                    categoria_producto,
                    precio,
                    stock
                `)
                .eq("stock", 0);

            if (errorAgotados) {
                console.error("❌ Error productos agotados:", errorAgotados);
            }

            const productosStockBajo = [
                ...(productosAgotadosData || []).map(p => ({
                    id: p.id_producto,
                    nombre: p.nombre_producto,
                    stock: p.stock,
                    precio: p.precio,
                    categoria: p.categoria_producto || 'Sin categoría',
                    estado: 'agotado',
                })),
                ...(productosStockBajoData || []).map(p => ({
                    id: p.id_producto,
                    nombre: p.nombre_producto,
                    stock: p.stock,
                    precio: p.precio,
                    categoria: p.categoria_producto || 'Sin categoría',
                    estado: 'bajo',
                })),
            ].sort((a, b) => a.stock - b.stock);

            console.log("📦 Productos stock bajo:", productosStockBajo.length);
            console.log("👤 Clientes por vencer:", clientesPorVencer.length);

            const resultado = {
                totalClientes: totalClientes || 0,
                totalProductos: totalProductos || 0,
                asistenciasHoy: asistenciasHoy || 0,
                ventasHoy,
                ventasHoyTotal,
                productosVendidosHoy,
                ingresosMes,
                ingresosProductosMes,
                ingresosProductosMesC$,
                ingresosMembresiasMes,
                clientesActivos: clientesActivos || 0,
                horarioPico,
                frecuenciaAsistencia,
                diaMayorConcurrencia,
                productoMasVendido,
                productosMasVendidos,
                ventasMes: ventasMes || [],
                membresiasMes: membresiasMes || [],
                clientesPorVencer,
                productosStockBajo,
            };

            console.log("📊 Resultado final:", resultado);
            setData(resultado);

        } catch (err) {
            console.error("Error al cargar dashboard:", err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDashboard();
    }, [tasaCambio]);

    const maxVentas = data.productosMasVendidos[0]?.[1] || 1;

    const fechaLegible = new Date().toLocaleDateString("es-ES", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const mesLegible = new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    const val = (v) => cargando ? (
        <span style={{ 
            display: "inline-block", 
            width: "40px", 
            height: "12px", 
            background: "linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%)",
            backgroundSize: "200% 100%",
            borderRadius: "6px",
            animation: "shimmer 1.5s infinite",
        }} />
    ) : v;

    const metricColors = {
        asistencias: theme.accent1,
        ventas: theme.accent5,
        productos: theme.accent2,
        ingresos: theme.accent4,
        clientes: theme.accent3,
        catalogo: theme.primary,
        alertas: theme.accent6,
    };

    const totalAlertas = data.clientesPorVencer.length + data.productosStockBajo.length;
    
    const POWER_BI_URL = "https://app.powerbi.com/view?r=eyJrIjoiYTMwOGVjY2UtY2E1MC00OGRiLTlmZmMtM2NlZGYzNDlkZDcxIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9";
    
    const secciones = [
        { id: 1, titulo: "Power BI", icono: "📊" },
        { id: 2, titulo: "Hoy", icono: "📅" },
        { id: 3, titulo: "General", icono: "📋" },
        { id: 4, titulo: "Alertas", icono: "⚠️" },
    ];
    const totalPaginasDashboard = secciones.length;

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>LiveFitnessGym</h1>
                    <p style={styles.subtitle}>Dashboard General del Gimnasio</p>
                </div>
                <div style={styles.dateBadge}>
                    <span style={{ fontSize: "16px" }}>📅</span>
                    {fechaLegible}
                </div>
            </div>

            {paginaDashboard === 1 && (
                <div>
                    <p style={styles.sectionLabel}>
                        <span style={{ color: theme.primary }}>📊 Power BI</span> — Análisis Avanzado
                    </p>
                    <div style={styles.powerBiContainer}>
                        <div style={styles.powerBiHeader}>
                            <div style={styles.powerBiTitle}>
                                <span style={{ fontSize: "22px" }}>📈</span>
                                Reportes de Power BI
                            </div>
                            <span style={styles.powerBiBadge}>
                                <span style={styles.dot(theme.primary)} />
                                En vivo
                            </span>
                        </div>
                        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", minHeight: "500px" }}>
                            <iframe
                                title="Power BI Dashboard"
                                src={POWER_BI_URL}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    borderRadius: "0 0 16px 16px",
                                }}
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <div style={styles.powerBiFooter}>
                            <span style={styles.powerBiFooterText}>
                                <i className="bi bi-info-circle me-1"></i>
                                Dashboard interactivo de Power BI · Actualizado en tiempo real
                            </span>
                            <a 
                                href={POWER_BI_URL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <button style={styles.powerBiButton}>
                                    <i className="bi bi-box-arrow-up-right me-1"></i>
                                    Abrir en pantalla completa
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {paginaDashboard === 2 && (
                <div>
                    <p style={styles.sectionLabel}>Hoy</p>
                    <div style={styles.grid}>
                        <div style={{...styles.card, ...(hoveredCard === 'asistencias' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('asistencias')}
                            onMouseLeave={() => setHoveredCard(null)}>
                            <div style={styles.cardGlow(metricColors.asistencias)} />
                            <span style={styles.cardIcon(metricColors.asistencias)}>🏃</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.asistencias)} />
                                Asistencias
                            </div>
                            <div style={styles.cardValue(metricColors.asistencias)}>{val(data.asistenciasHoy)}</div>
                            <div style={styles.cardSub}>personas hoy</div>
                        </div>

                        <div style={{...styles.card, ...(hoveredCard === 'ventas' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('ventas')}
                            onMouseLeave={() => setHoveredCard(null)}>
                            <div style={styles.cardGlow(metricColors.ventas)} />
                            <span style={styles.cardIcon(metricColors.ventas)}>🛒</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.ventas)} />
                                Ventas del día
                            </div>
                            <div style={styles.cardValue(metricColors.ventas)}>{val(data.ventasHoy)}</div>
                            <div style={styles.cardSub}>
                                {cargando ? "—" : `$${data.ventasHoyTotal.toLocaleString()} en ventas`}
                            </div>
                        </div>

                        <div style={{...styles.card, ...(hoveredCard === 'productos' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('productos')}
                            onMouseLeave={() => setHoveredCard(null)}>
                            <div style={styles.cardGlow(metricColors.productos)} />
                            <span style={styles.cardIcon(metricColors.productos)}>📦</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.productos)} />
                                Productos vendidos
                            </div>
                            <div style={styles.cardValue(metricColors.productos)}>{val(data.productosVendidosHoy)}</div>
                            <div style={styles.cardSub}>unidades despachadas hoy</div>
                        </div>

                        <div style={{...styles.card, ...(hoveredCard === 'ingresos' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('ingresos')}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setMostrarIngresos(true)}>
                            <div style={styles.cardGlow(metricColors.ingresos)} />
                            <span style={styles.cardIcon(metricColors.ingresos)}>💰</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.ingresos)} />
                                Ingresos del mes
                            </div>
                            <div style={{...styles.cardValue(metricColors.ingresos), fontSize: data.ingresosMes > 999999 ? "28px" : "36px"}}>
                                C${val(data.ingresosMes.toLocaleString())}
                            </div>
                            <div style={styles.cardSub}>{mesLegible} · Click para ver detalle</div>
                        </div>
                    </div>
                </div>
            )}

            {paginaDashboard === 3 && (
                <div>
                    <p style={styles.sectionLabel}>General</p>
                    <div style={styles.grid2}>
                        <div style={{...styles.card, ...(hoveredCard === 'clientes' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('clientes')}
                            onMouseLeave={() => setHoveredCard(null)}>
                            <div style={styles.cardGlow(metricColors.clientes)} />
                            <span style={styles.cardIcon(metricColors.clientes)}>👥</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.clientes)} />
                                Clientes totales
                            </div>
                            <div style={styles.cardValue(metricColors.clientes)}>{val(data.totalClientes)}</div>
                            <div style={styles.cardSub}>
                                <span style={styles.pill(theme.accent4)}>
                                    <span style={styles.dot(theme.accent4)} />
                                    {val(data.clientesActivos)} activos
                                </span>
                            </div>
                        </div>

                        <div style={{...styles.card, ...(hoveredCard === 'catalogo' ? styles.cardHover : {})}}
                            onMouseEnter={() => setHoveredCard('catalogo')}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setMostrarCatalogo(true)}
                            title="Click para ver catálogo completo">
                            <div style={styles.cardGlow(metricColors.catalogo)} />
                            <span style={styles.cardIcon(metricColors.catalogo)}>🏷️</span>
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(metricColors.catalogo)} />
                                Catálogo de productos
                            </div>
                            <div style={styles.cardValue(metricColors.catalogo)}>{val(data.totalProductos)}</div>
                            <div style={styles.cardSub}>productos en sistema · Click para ver</div>
                        </div>

                        <div style={{...styles.heroCard, ...(hoveredCard === 'hero' ? { transform: "translateY(-3px) scale(1.01)" } : {})}}
                            onMouseEnter={() => setHoveredCard('hero')}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setMostrarKPI(true)}>
                            <div style={styles.heroCardGlow} />
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <div style={styles.heroLabel}>💎 Ingresos del Mes</div>
                                <h2 style={styles.heroValue}>C${data.ingresosMes.toLocaleString()}</h2>
                                <p style={styles.heroSub}>Crecimiento de este mes · Click para ver KPIs</p>
                            </div>
                            <div style={{position: "absolute", bottom: "20px", right: "20px", fontSize: "60px", opacity: 0.06}}>📊</div>
                        </div>
                    </div>
                </div>
            )}

            {paginaDashboard === 4 && (
                <div>
                    <p style={styles.sectionLabel}>
                        <span style={{ color: theme.accent6 }}>⚠️ Alertas</span>
                    </p>
                    <div style={styles.grid}>
                        <div 
                            style={{
                                ...styles.alertCard, 
                                ...(hoveredCard === 'alertas' ? styles.alertCardHover : {})
                            }}
                            onMouseEnter={() => setHoveredCard('alertas')}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setMostrarAlertas(true)}
                            title="Click para ver todas las alertas"
                        >
                            <div style={styles.alertCardGlow} />
                            <div style={styles.alertBadge}>
                                {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''}
                            </div>
                            <span style={{...styles.cardIcon(theme.accent6), fontSize: "28px"}}>🚨</span>

                            <div style={styles.cardLabel}>
                                <span style={{...styles.dot(theme.accent6), animation: "pulse 2s infinite"}} />
                                Alertas del Sistema
                            </div>

                            <div style={styles.cardValue(theme.accent6)}>
                                {val(totalAlertas)}
                            </div>

                            <div style={styles.cardSub}>
                                {totalAlertas > 0 ? (
                                    <span>
                                        <span style={{color: theme.accent6, fontWeight: 700}}>
                                            {data.clientesPorVencer.length}
                                        </span> membresías por vencer · 
                                        <span style={{color: theme.accent7, fontWeight: 700}}>
                                            {data.productosStockBajo.length}
                                        </span> productos con stock bajo
                                    </span>
                                ) : (
                                    "No hay alertas pendientes"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.paginationContainer}>
                <button
                    onClick={() => cambiarPaginaDashboard(paginaDashboard - 1)}
                    disabled={paginaDashboard === 1}
                    style={{
                        ...styles.paginationButton,
                        ...(paginaDashboard === 1 ? styles.paginationButtonDisabled : {})
                    }}
                >
                    ← Anterior
                </button>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {secciones.map((seccion) => (
                        <button
                            key={seccion.id}
                            onClick={() => cambiarPaginaDashboard(seccion.id)}
                            style={{
                                ...styles.paginationNumber,
                                ...(paginaDashboard === seccion.id ? styles.paginationNumberActive : {})
                            }}
                            title={seccion.titulo}
                        >
                            <span>{seccion.icono}</span>
                            <span>{seccion.id}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => cambiarPaginaDashboard(paginaDashboard + 1)}
                    disabled={paginaDashboard === totalPaginasDashboard}
                    style={{
                        ...styles.paginationButton,
                        ...(paginaDashboard === totalPaginasDashboard ? styles.paginationButtonDisabled : {})
                    }}
                >
                    Siguiente →
                </button>
            </div>

            <div style={styles.paginationInfo}>
                Página {paginaDashboard} de {totalPaginasDashboard} · 
                <span style={{ color: theme.primary, fontWeight: 700 }}>
                    {secciones[paginaDashboard - 1]?.icono} {secciones[paginaDashboard - 1]?.titulo}
                </span>
            </div>

            <Modal show={mostrarKPI} onHide={() => setMostrarKPI(false)} centered size="lg" contentClassName="border-0">
                <Modal.Header closeButton style={styles.modalHeader}>
                    <Modal.Title style={{ fontWeight: 800, color: theme.text, fontSize: "20px" }}>
                        <span style={{ marginRight: "8px" }}>📊</span>
                        KPIs del Sistema
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={styles.modalBody}>
                    <div style={styles.grid}>
                        <div style={{...styles.card, padding: "20px 24px", background: theme.bgGlass, backdropFilter: "blur(12px)"}}>
                            <div style={styles.cardGlow(theme.accent1)} />
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(theme.accent1)} />
                                Horario pico
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: theme.accent1 }}>{data.horarioPico}</div>
                        </div>

                        <div style={{...styles.card, padding: "20px 24px", background: theme.bgGlass, backdropFilter: "blur(12px)"}}>
                            <div style={styles.cardGlow(theme.accent4)} />
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(theme.accent4)} />
                                Día más concurrido
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: theme.accent4, textTransform: "capitalize" }}>{data.diaMayorConcurrencia}</div>
                        </div>

                        <div style={{...styles.card, padding: "20px 24px", background: theme.bgGlass, backdropFilter: "blur(12px)"}}>
                            <div style={styles.cardGlow(theme.accent3)} />
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(theme.accent3)} />
                                Frec. promedio asist.
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: theme.accent3 }}>
                                {data.frecuenciaAsistencia} <span style={{ fontSize: "13px", color: theme.textSubtle, fontWeight: 400 }}>visitas/cliente</span>
                            </div>
                        </div>

                        <div style={{...styles.card, padding: "20px 24px", background: theme.bgGlass, backdropFilter: "blur(12px)"}}>
                            <div style={styles.cardGlow(theme.accent5)} />
                            <div style={styles.cardLabel}>
                                <span style={styles.dot(theme.accent5)} />
                                Producto más vendido
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: theme.accent5, lineHeight: 1.3 }}>{data.productoMasVendido}</div>
                        </div>
                    </div>

                    <hr style={styles.divider} />

                    <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "20px", color: theme.text }}>
                        <span style={{ marginRight: "8px" }}>🏆</span>
                        Ranking — Productos más vendidos
                    </div>

                    {data.productosMasVendidos.length === 0 ? (
                        <p style={{ color: theme.textMuted, fontSize: "14px" }}>No hay ventas registradas aún.</p>
                    ) : (
                        data.productosMasVendidos.slice(0, 5).map(([nombre, cantidad], i) => {
                            const pct = Math.round((cantidad / maxVentas) * 100);
                            const colores = [theme.accent5, theme.accent1, theme.accent3, theme.accent2, theme.primary];
                            const color = colores[i] || theme.primary;
                            return (
                                <div key={i} style={styles.rankRow}>
                                    <div style={{ flex: 1, marginRight: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", alignItems: "center" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 600, color: theme.text }}>
                                                <span style={{ color: color, marginRight: "10px", fontWeight: 800 }}>#{i + 1}</span>
                                                {nombre}
                                            </span>
                                            <span style={styles.pill(color)}>{cantidad} uds.</span>
                                        </div>
                                        <div style={{ height: "8px", borderRadius: "4px", background: theme.bgElevated, overflow: "hidden" }}>
                                            <div style={styles.rankBar(pct, color)} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <hr style={styles.divider} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                        <span style={{ color: theme.textMuted, fontSize: "14px" }}>Ingresos totales del mes</span>
                        <span style={{ fontWeight: 800, fontSize: "24px", color: theme.accent4 }}>C${data.ingresosMes.toLocaleString()}</span>
                    </div>
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    <Button size="sm" style={styles.btnSecondary} onClick={() => setMostrarKPI(false)}>Cerrar</Button>
                    <Button size="sm" style={styles.btnPrimary} onClick={cargarDashboard}>↻ Actualizar datos</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={mostrarIngresos} onHide={() => setMostrarIngresos(false)} centered size="lg" contentClassName="border-0">
                <Modal.Header closeButton style={styles.modalHeader}>
                    <Modal.Title style={{ fontWeight: 800, color: theme.text, fontSize: "20px" }}>
                        <span style={{ marginRight: "8px" }}>💰</span>
                        Total de Ingresos — {mesLegible}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={styles.modalBody}>
                    <div style={{
                        ...styles.ingresoCard,
                        background: `linear-gradient(135deg, ${theme.accent3}15, ${theme.accent3}08)`,
                        borderColor: `${theme.accent3}40`,
                        marginBottom: "24px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                                <div style={{...styles.ingresoLabel, marginBottom: "4px"}}>
                                    Tasa de Cambio
                                </div>
                                <div style={{ fontSize: "14px", color: theme.textMuted }}>
                                    1 USD = {tasaCambio} Córdobas
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {editandoTasa ? (
                                    <>
                                        <Form.Control
                                            type="number"
                                            value={tasaCambio}
                                            onChange={(e) => setTasaCambio(Number(e.target.value))}
                                            style={{ width: "100px", fontSize: "14px", fontWeight: 700 }}
                                            step="0.1"
                                            min="0.1"
                                        />
                                        <Button variant="success" size="sm" onClick={() => setEditandoTasa(false)}>✓</Button>
                                    </>
                                ) : (
                                    <Button variant="outline-primary" size="sm" onClick={() => setEditandoTasa(true)}>✏️ Cambiar</Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        ...styles.ingresoCard,
                        background: `linear-gradient(135deg, ${theme.accent4}15, ${theme.accent4}08)`,
                        borderColor: `${theme.accent4}40`,
                        textAlign: "center",
                    }}>
                        <div style={styles.ingresoLabel}>Total Ingresos del Mes</div>
                        <div style={{...styles.ingresoValue, color: theme.accent4, fontSize: "42px"}}>
                            C${data.ingresosMes.toLocaleString()}
                        </div>
                        <div style={styles.ingresoSub}>Suma de productos (convertidos) + membresías</div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                            <div style={{
                                ...styles.ingresoCard,
                                borderLeft: `4px solid ${theme.accent2}`,
                            }}>
                                <div style={styles.ingresoLabel}>
                                    <span style={{...styles.dot(theme.accent2), marginRight: "8px"}} />
                                    Ventas de Productos
                                </div>
                                <div style={{...styles.ingresoValue, color: theme.accent2}}>
                                    ${data.ingresosProductosMes.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "14px", color: theme.accent2, marginTop: "4px", fontWeight: 600 }}>
                                    = C${data.ingresosProductosMesC$.toLocaleString()}
                                </div>
                                <div style={styles.ingresoSub}>
                                    Dólares (USD) convertidos a Córdobas
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                    <small style={{ color: theme.textMuted }}>
                                        {data.ventasMes?.length || 0} ventas registradas este mes
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
                            <div style={{
                                ...styles.ingresoCard,
                                borderLeft: `4px solid ${theme.accent1}`,
                            }}>
                                <div style={styles.ingresoLabel}>
                                    <span style={{...styles.dot(theme.accent1), marginRight: "8px"}} />
                                    Pagos de Membresías
                                </div>
                                <div style={{...styles.ingresoValue, color: theme.accent1}}>
                                    C${data.ingresosMembresiasMes.toLocaleString()}
                                </div>
                                <div style={styles.ingresoSub}>
                                    Córdobas (NIO)
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                    <small style={{ color: theme.textMuted }}>
                                        {data.membresiasMes?.length || 0} membresías registradas este mes
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={styles.divider} />

                    <div style={{ marginTop: "20px" }}>
                        <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "16px", color: theme.text }}>
                            Distribución de Ingresos (en C$)
                        </div>

                        {data.ingresosMes > 0 && (
                            <div>
                                <div style={{ marginBottom: "12px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>
                                            Productos (C${data.ingresosProductosMesC$.toLocaleString()})
                                        </span>
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: theme.accent2 }}>
                                            {((data.ingresosProductosMesC$ / data.ingresosMes) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div style={{ height: "12px", borderRadius: "6px", background: theme.bgElevated, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%",
                                            borderRadius: "6px",
                                            background: `linear-gradient(90deg, ${theme.accent2}, ${theme.accent2}88)`,
                                            width: `${(data.ingresosProductosMesC$ / data.ingresosMes) * 100}%`,
                                            transition: "width 1s ease",
                                        }} />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>
                                            Membresías (C${data.ingresosMembresiasMes.toLocaleString()})
                                        </span>
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: theme.accent1 }}>
                                            {((data.ingresosMembresiasMes / data.ingresosMes) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div style={{ height: "12px", borderRadius: "6px", background: theme.bgElevated, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%",
                                            borderRadius: "6px",
                                            background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent1}88)`,
                                            width: `${(data.ingresosMembresiasMes / data.ingresosMes) * 100}%`,
                                            transition: "width 1s ease",
                                        }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    <Button size="sm" style={styles.btnSecondary} onClick={() => setMostrarIngresos(false)}>
                        Cerrar
                    </Button>
                    <Button size="sm" style={styles.btnPrimary} onClick={cargarDashboard}>
                        ↻ Actualizar datos
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={mostrarAlertas} onHide={() => setMostrarAlertas(false)} centered size="lg" contentClassName="border-0">
                <Modal.Header closeButton style={{
                    ...styles.modalHeader,
                    background: `linear-gradient(135deg, ${theme.accent6}08, ${theme.accent7}08)`,
                    borderBottom: `1px solid ${theme.accent6}30`,
                }}>
                    <Modal.Title style={{ fontWeight: 800, color: theme.text, fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>🚨</span>
                        Reporte de Alertas
                        <Badge bg="danger" style={{ fontSize: "12px", borderRadius: "10px" }}>
                            {totalAlertas} total
                        </Badge>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={styles.modalBody}>
                    <div style={{ marginBottom: "32px" }}>
                        <div style={styles.alertSectionTitle}>
                            <span style={{ fontSize: "18px" }}>👤</span>
                            Membresías por Vencer (próximos 3 días)
                            <Badge 
                                bg={data.clientesPorVencer.length > 0 ? "danger" : "success"} 
                                style={{ marginLeft: "8px", fontSize: "11px" }}
                            >
                                {data.clientesPorVencer.length}
                            </Badge>
                        </div>

                        {data.clientesPorVencer.length === 0 ? (
                            <div style={styles.alertEmpty}>
                                <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>✅</span>
                                No hay membresías por vencer en los próximos 3 días
                            </div>
                        ) : (
                            <div style={{ ...styles.ingresoCard, padding: "16px 20px" }}>
                                {data.clientesPorVencer.map((cliente, index) => {
                                    const isLast = index === data.clientesPorVencer.length - 1;
                                    const diasColor = cliente.diasRestantes <= 1 ? theme.accent6 : theme.accent7;
                                    
                                    return (
                                        <div key={cliente.id} style={isLast ? styles.alertItemLast : styles.alertItem}>
                                            <div style={{ flex: 1 }}>
                                                <div style={styles.alertItemName}>
                                                    <span style={{ fontSize: "16px" }}>👤</span>
                                                    {cliente.nombre}
                                                </div>
                                                <div style={styles.alertItemDetail}>
                                                    📧 {cliente.correo} · 📞 {cliente.telefono}
                                                </div>
                                                <div style={{ ...styles.alertItemDetail, marginTop: "4px" }}>
                                                    🏷️ {cliente.membresia} · 📅 Vence: {new Date(cliente.fechaVencimiento).toLocaleDateString("es-ES")}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                                <span style={styles.alertItemBadge(diasColor)}>
                                                    {cliente.diasRestantes === 0 ? "⚠️ Vence HOY" : 
                                                     cliente.diasRestantes === 1 ? "⏰ 1 día" : 
                                                     `${cliente.diasRestantes} días`}
                                                </span>
                                                {cliente.diasRestantes <= 1 && (
                                                    <span style={{ fontSize: "10px", color: theme.accent6, fontWeight: 700 }}>
                                                        ¡URGENTE!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <hr style={styles.divider} />

                    <div>
                        <div style={styles.alertSectionTitle}>
                            <span style={{ fontSize: "18px" }}>📦</span>
                            Productos con Stock Bajo (&lt; 3 unidades)
                            <Badge 
                                bg={data.productosStockBajo.length > 0 ? "warning" : "success"} 
                                style={{ marginLeft: "8px", fontSize: "11px", color: data.productosStockBajo.length > 0 ? "#fff" : "inherit" }}
                            >
                                {data.productosStockBajo.length}
                            </Badge>
                        </div>

                        {data.productosStockBajo.length === 0 ? (
                            <div style={styles.alertEmpty}>
                                <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>✅</span>
                                Todos los productos tienen stock suficiente
                            </div>
                        ) : (
                            <div style={{ ...styles.ingresoCard, padding: "16px 20px" }}>
                                {data.productosStockBajo.map((producto, index) => {
                                    const isLast = index === data.productosStockBajo.length - 1;
                                    const stockColor = producto.stock === 0 ? theme.accent6 : theme.accent7;
                                    const stockLabel = producto.stock === 0 ? "AGOTADO" : `${producto.stock} unid.`;
                                    
                                    return (
                                        <div key={producto.id} style={isLast ? styles.alertItemLast : styles.alertItem}>
                                            <div style={{ flex: 1 }}>
                                                <div style={styles.alertItemName}>
                                                    <span style={{ fontSize: "16px" }}>
                                                        {producto.stock === 0 ? "❌" : "⚠️"}
                                                    </span>
                                                    {producto.nombre}
                                                </div>
                                                <div style={styles.alertItemDetail}>
                                                    🏷️ {producto.categoria} · 💵 ${producto.precio}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                                <span style={styles.alertItemBadge(stockColor)}>
                                                    {stockLabel}
                                                </span>
                                                {producto.stock === 0 && (
                                                    <span style={{ fontSize: "10px", color: theme.accent6, fontWeight: 700 }}>
                                                        ¡REABASTECER!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    <Button size="sm" style={styles.btnSecondary} onClick={() => setMostrarAlertas(false)}>
                        Cerrar
                    </Button>
                    <Button 
                        size="sm" 
                        style={{
                            ...styles.btnPrimary,
                            background: theme.accent6,
                            boxShadow: `0 4px 15px ${theme.accent6}44`,
                        }} 
                        onClick={cargarDashboard}
                    >
                        ↻ Actualizar alertas
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={mostrarCatalogo} onHide={() => setMostrarCatalogo(false)} centered size="xl" contentClassName="border-0">
                <Modal.Header closeButton style={styles.modalHeader}>
                    <Modal.Title style={{ fontWeight: 800, color: theme.text, fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>🏷️</span>
                        Catálogo de Productos
                        <Badge bg="primary" style={{ fontSize: "12px", borderRadius: "10px" }}>
                            {data.totalProductos} productos
                        </Badge>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{...styles.modalBody, padding: "20px"}}>
                    <CatalogoModal />
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    <Button size="sm" style={styles.btnSecondary} onClick={() => setMostrarCatalogo(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <footer style={{
                marginTop: "40px",
                padding: "32px",
                background: "linear-gradient(135deg, #1F2937, #111827)",
                borderRadius: "16px",
                boxShadow: theme.shadowSoft,
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "24px",
                }}>
                    <div>
                        <div style={{
                            background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                            borderRadius: "16px",
                            padding: "24px",
                            textAlign: "center",
                        }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontSize: "24px",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                            }}>
                                <i className="bi bi-building"></i>
                            </div>
                            <h5 style={{ color: "white", fontWeight: 700, marginBottom: 4 }}>LiveFitnessGym</h5>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>
                                Sistema de gestión integral
                            </p>
                        </div>
                    </div>

                    <div style={{
                        background: "#F9FAFB",
                        borderRadius: "16px",
                        padding: "24px",
                    }}>
                        <h6 style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#1F2937",
                            marginBottom: "16px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}>
                            <i className="bi bi-bar-chart-line me-2 text-primary"></i>
                            Resumen del Mes
                        </h6>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #10B981, #059669)",
                                        color: "white",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <i className="bi bi-cash-stack"></i>
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#4B5563" }}>Ingresos</span>
                                </div>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#10B981" }}>
                                    C${data.ingresosMes.toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #F59E0B, #D97706)",
                                        color: "white",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <i className="bi bi-people-fill"></i>
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#4B5563" }}>Clientes activos</span>
                                </div>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>
                                    {data.clientesActivos}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                        color: "white",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <i className="bi bi-cart"></i>
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#4B5563" }}>Ventas</span>
                                </div>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#8B5CF6" }}>
                                    {data.ventasMes?.length || 0}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: "50%",
                                        background: totalAlertas > 0 ? "linear-gradient(135deg, #EF4444, #DC2626)" : "linear-gradient(135deg, #10B981, #059669)",
                                        color: "white",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <i className="bi bi-exclamation-triangle"></i>
                                    </div>
                                    <span style={{ fontSize: "14px", color: "#4B5563" }}>Alertas</span>
                                </div>
                                <span style={{ 
                                    fontSize: "14px", 
                                    fontWeight: 700, 
                                    color: totalAlertas > 0 ? "#EF4444" : "#10B981" 
                                }}>
                                    {totalAlertas}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: "#F9FAFB",
                        borderRadius: "16px",
                        padding: "24px",
                    }}>
                        <h6 style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#1F2937",
                            marginBottom: "16px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}>
                            <i className="bi bi-activity me-2 text-success"></i>
                            Estado del Sistema
                        </h6>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <Badge 
                                bg="success" 
                                className="px-3 py-2"
                                style={{ fontSize: "12px", background: "linear-gradient(135deg, #10B981, #059669)" }}
                            >
                                <i className="bi bi-wifi me-1"></i>
                                Online
                            </Badge>
                            <Badge 
                                bg="primary" 
                                className="px-3 py-2"
                                style={{ fontSize: "12px", background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                            >
                                <i className="bi bi-shield-check me-1"></i>
                                Seguro
                            </Badge>
                            <Badge 
                                bg="info" 
                                className="px-3 py-2"
                                style={{ fontSize: "12px", background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}
                            >
                                <i className="bi bi-database me-1"></i>
                                Supabase
                            </Badge>
                        </div>
                        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" }}>
                            <small style={{ fontSize: "12px", color: "#64748B" }}>
                                <i className="bi bi-c-circle me-1"></i>
                                {new Date().getFullYear()} Todos los derechos reservados
                            </small>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: "24px",
                    padding: "16px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <small style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                        <i className="bi bi-code-slash me-1"></i>
                        Desarrollado con React + Bootstrap · 
                        <span style={{ marginLeft: "4px" }}>
                            <i className="bi bi-heart-fill me-1 text-danger"></i>
                            para tu gimnasio
                        </span>
                    </small>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;