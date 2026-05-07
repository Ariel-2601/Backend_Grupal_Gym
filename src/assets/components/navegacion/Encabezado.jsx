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

import logo from "../../../assets/logo.png";

function Encabezado() {

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // =========================
  // Toggle menú
  // =========================

  const manejarToggle = () => {
    setMostrarMenu(!mostrarMenu);
  };

  // =========================
  // Navegación
  // =========================

  const manejarNavegacion = (ruta) => {

    navigate(ruta);

    setMostrarMenu(false);
  };

  // =========================
  // Cerrar sesión
  // =========================

  const cerrarSesion = async () => {

    localStorage.removeItem("usuario");

    navigate("/login");
  };

  // =========================
  // Ocultar navbar en login
  // =========================

  if (location.pathname === "/login") return null;

  // =========================
  // Render
  // =========================

  return (

    <Navbar
      expand={false}
      className="color-navbar shadow-sm"
      variant="dark"
      fixed="top"
    >

      <Container fluid>

        {/* Logo */}

        <Navbar.Brand
          onClick={() => manejarNavegacion("/")}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center"
        >

          <img
            src={logo}
            alt="Logo"
            width="45"
            height="45"
            className="me-2 rounded-circle"
          />

          <strong className="fs-4">
            GymLiveFitness
          </strong>

        </Navbar.Brand>

        {/* Botón hamburguesa */}

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={manejarToggle}
        />

        {/* Menú lateral */}

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          show={mostrarMenu}
          onHide={manejarToggle}
          placement="end"
        >

          <Offcanvas.Header closeButton>

            <Offcanvas.Title>
              GymLiveFitness
            </Offcanvas.Title>

          </Offcanvas.Header>

          <Offcanvas.Body>

            <Nav className="justify-content-end flex-grow-1 pe-3">

              {/* Dashboard */}

              <Nav.Link
                onClick={() => manejarNavegacion("/")}
              >
                📊 Dashboard
              </Nav.Link>

              {/* Clientes */}

              <Nav.Link
                onClick={() => manejarNavegacion("/clientes")}
              >
                👥 Clientes
              </Nav.Link>

              {/* Membresías */}

              <Nav.Link
                onClick={() => manejarNavegacion("/membresias")}
              >
                🪪 Membresías
              </Nav.Link>

              {/* Asistencias */}

              <Nav.Link
                onClick={() => manejarNavegacion("/asistencias")}
              >
                📅 Asistencias
              </Nav.Link>

              {/* Ventas */}

              <Nav.Link
                onClick={() => manejarNavegacion("/ventas")}
              >
                💰 Ventas
              </Nav.Link>

              {/* Productos */}

              <Nav.Link
                onClick={() => manejarNavegacion("/productos")}
              >
                📦 Productos
              </Nav.Link>

              {/* Cerrar sesión */}

              <Nav.Link
                onClick={cerrarSesion}
                className="text-danger fw-bold mt-3"
              >
                🚪 Cerrar Sesión
              </Nav.Link>

            </Nav>

          </Offcanvas.Body>

        </Navbar.Offcanvas>

      </Container>

    </Navbar>
  );
}

export default Encabezado;