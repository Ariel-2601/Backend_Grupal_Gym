import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../../assets/logo.png";

function Encabezado() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    // ... (mantén tu lógica actual)
  };

  if (location.pathname === "/login") return null;

  return (
    <Navbar bg="dark" variant="dark" expand={false} className="color-navbar">
      <Container fluid>
        <Navbar.Brand 
          onClick={() => manejarNavegacion("/")} 
          style={{ cursor: "pointer", color: "white" }}
        >
          <img src={logo} alt="Logo" width="45" height="45" className="d-inline-block align-top me-2" />
          <strong>GymLiveFitness</strong>
        </Navbar.Brand>

        <Navbar.Toggle onClick={manejarToggle} />

        <Navbar.Offcanvas show={mostrarMenu} onHide={manejarToggle} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>GymLiveFitness - LiveFitness</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => manejarNavegacion("/")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>Catálogo</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/productos")}>Productos</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/categorias")}>Categorías</Nav.Link>
              <Nav.Link onClick={cerrarSesion}>Cerrar Sesión</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Encabezado;