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

function Encabezado() {

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

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

      localStorage.removeItem(
        "usuario-supabase"
      );

      navigate("/login");

    } catch (error) {

      console.error(
        "Error al cerrar sesión:",
        error
      );
    }
  };

  if (location.pathname === "/login")
    return null;

  return (

    <Navbar
      expand="lg"
      className="color-navbar shadow-sm"
      variant="dark"
      fixed="top"
    >

      <Container fluid>

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

        {/* Menú escritorio */}

        <Nav className="ms-auto d-none d-lg-flex align-items-center">

          <Nav.Link
            onClick={() => manejarNavegacion("/")}
          >
            📊 Dashboard
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/clientes")}
          >
            👥 Clientes
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/membresias")}
          >
            🪪 Membresías
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/asistencias")}
          >
            📅 Asistencias
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/ventas")}
          >
            💰 Ventas
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/productos")}
          >
            📦 Productos
          </Nav.Link>

          <Nav.Link
            onClick={() => manejarNavegacion("/catalogo")}
          >
            🛒 Catálogo
          </Nav.Link>

          <Nav.Link
            onClick={cerrarSesion}
            className="text-danger fw-bold"
          >
            🚪 Cerrar Sesión
          </Nav.Link>

        </Nav>

        {/* Botón hamburguesa */}

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={manejarToggle}
          className="d-lg-none"
        />

        {/* Menú móvil */}

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          show={mostrarMenu}
          onHide={manejarToggle}
          placement="end"
          className="d-lg-none"
        >

          <Offcanvas.Header closeButton>

            <Offcanvas.Title>
              GymLiveFitness
            </Offcanvas.Title>

          </Offcanvas.Header>

          <Offcanvas.Body>

            <Nav className="justify-content-end flex-grow-1 pe-3">

              <Nav.Link
                onClick={() => manejarNavegacion("/")}
              >
                📊 Dashboard
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/clientes")}
              >
                👥 Clientes
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/membresias")}
              >
                🪪 Membresías
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/asistencias")}
              >
                📅 Asistencias
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/ventas")}
              >
                💰 Ventas
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/productos")}
              >
                📦 Productos
              </Nav.Link>

              <Nav.Link
                onClick={() => manejarNavegacion("/catalogo")}
              >
                🛒 Catálogo
              </Nav.Link>

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