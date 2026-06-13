import React, { useState } from "react";
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  Container,
  Nav,
  Navbar,
  Offcanvas
} from "react-bootstrap";

import { supabase } from "../../../assets/database/supabaseconfig";
import logo from "../../../assets/logo.png";


const theme = {
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  bg: "rgba(15, 23, 42, 0.92)",
  bgSolid: "#0F172A",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  accent: "#EC4899",
  danger: "#EF4444",
  glass: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glow: "0 0 20px rgba(79, 70, 229, 0.3)",
};

function Encabezado() {

  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detectar scroll para efecto glassmorphism
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const manejarToggle = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("usuario-supabase");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (location.pathname === "/login")
    return null;

  // Items de navegación - labels más cortos para ahorrar espacio
  const navItems = [
    { ruta: "/", icono: "📊", label: "Dashboard" },
    { ruta: "/clientes", icono: "👥", label: "Clientes" },
    { ruta: "/membresias", icono: "🪪", label: "Membresías" },
    { ruta: "/membresias-clientes", icono: "👥", label: "Memb. Clientes" },
    { ruta: "/asistencias", icono: "📅", label: "Asistencias" },
    { ruta: "/ventas", icono: "💰", label: "Ventas" },
    { ruta: "/productos", icono: "📦", label: "Productos" },
  ];

  const isActive = (ruta) => location.pathname === ruta;

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        background: scrolled ? theme.bg : "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.glassBorder}`,
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.3s ease",
        padding: "6px 0",
        minHeight: "56px",
      }}
      variant="dark"
    >
      <Container fluid style={{ padding: "0 20px" }}>

        {/* Logo compacto */}
        <Navbar.Brand
          onClick={() => manejarNavegacion("/")}
          style={{ 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: 0,
            margin: 0,
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: theme.glow,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <img
              src={logo}
              alt="Logo"
              width="28"
              height="28"
              style={{ borderRadius: "6px" }}
            />
          </div>

          <strong style={{
            fontSize: "16px",
            fontWeight: 800,
            color: theme.text,
            letterSpacing: "-0.3px",
            whiteSpace: "nowrap",
            background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.primaryLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            LiveFitnessGym
          </strong>
        </Navbar.Brand>

        {/* Menú escritorio - todo en una línea compacta */}
        <Nav className="ms-auto d-none d-lg-flex align-items-center" style={{ gap: "2px" }}>
          {navItems.map((item) => (
            <Nav.Link
              key={item.ruta}
              onClick={() => manejarNavegacion(item.ruta)}
              style={{
                position: "relative",
                padding: "6px 10px",
                borderRadius: "8px",
                color: isActive(item.ruta) ? theme.primaryLight : theme.textMuted,
                fontWeight: isActive(item.ruta) ? 700 : 500,
                fontSize: "12px",
                letterSpacing: "0.2px",
                transition: "all 0.2s ease",
                background: isActive(item.ruta) 
                  ? theme.glass 
                  : "transparent",
                border: isActive(item.ruta) 
                  ? `1px solid ${theme.glassBorder}` 
                  : "1px solid transparent",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "14px" }}>{item.icono}</span>
              <span>{item.label}</span>
              {isActive(item.ruta) && (
                <div style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "16px",
                  height: "2px",
                  borderRadius: "1px",
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                }} />
              )}
            </Nav.Link>
          ))}

          {/* Divider compacto */}
          <div style={{
            width: "1px",
            height: "18px",
            background: theme.glassBorder,
            margin: "0 6px",
            flexShrink: 0,
          }} />

          {/* Cerrar sesión compacto */}
          <Nav.Link
            onClick={cerrarSesion}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              color: theme.danger,
              fontWeight: 600,
              fontSize: "12px",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.1)";
              e.target.style.borderColor = "rgba(239, 68, 68, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "transparent";
            }}
          >
            <span style={{ fontSize: "14px" }}>🚪</span>
            <span>Salir</span>
          </Nav.Link>
        </Nav>

        {/* Botón hamburguesa compacto */}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={manejarToggle}
          className="d-lg-none"
          style={{
            border: `1px solid ${theme.glassBorder}`,
            borderRadius: "8px",
            padding: "6px 10px",
            fontSize: "14px",
          }}
        />

        {/* Menú móvil */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          show={mostrarMenu}
          onHide={manejarToggle}
          placement="end"
          className="d-lg-none"
          style={{
            background: theme.bgSolid,
            borderLeft: `1px solid ${theme.glassBorder}`,
            width: "280px",
          }}
        >
          <Offcanvas.Header 
            closeButton
            style={{
              borderBottom: `1px solid ${theme.glassBorder}`,
              padding: "16px 20px",
            }}
          >
            <Offcanvas.Title style={{
              fontWeight: 800,
              fontSize: "16px",
              color: theme.text,
              background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.primaryLight} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              LiveFitnessGym
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body style={{ padding: "12px 16px" }}>
            <Nav className="flex-column" style={{ gap: "4px" }}>
              {navItems.map((item) => (
                <Nav.Link
                  key={item.ruta}
                  onClick={() => manejarNavegacion(item.ruta)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: isActive(item.ruta) ? theme.primaryLight : theme.textMuted,
                    fontWeight: isActive(item.ruta) ? 700 : 500,
                    fontSize: "13px",
                    transition: "all 0.2s ease",
                    background: isActive(item.ruta) 
                      ? `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)` 
                      : "transparent",
                    border: isActive(item.ruta) 
                      ? `1px solid ${theme.primary}33` 
                      : "1px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{item.icono}</span>
                  <span>{item.label}</span>
                  {isActive(item.ruta) && (
                    <div style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: theme.primaryLight,
                      boxShadow: `0 0 6px ${theme.primaryLight}`,
                    }} />
                  )}
                </Nav.Link>
              ))}

              <div style={{
                height: "1px",
                background: theme.glassBorder,
                margin: "8px 0",
              }} />

              <Nav.Link
                onClick={cerrarSesion}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  color: theme.danger,
                  fontWeight: 700,
                  fontSize: "13px",
                  transition: "all 0.2s ease",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "18px" }}>🚪</span>
                <span>Cerrar Sesión</span>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

      </Container>
    </Navbar>
  );
}

export default Encabezado;