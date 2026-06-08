import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Encabezado from "./assets/components/navegacion/Encabezado";

import Dashboard from "./assets/views/Dashboard";
import Clientes from "./assets/views/Clientes";
import Membresias from "./assets/views/Membresias";
import Asistencias from "./assets/views/Asistencias";
import Ventas from "./assets/views/Ventas";
import Productos from "./assets/views/Productos";
import Catalogo from "./assets/views/Catalogo";
import MembresiasClientes from "./assets/views/MembresiasClientes";

import Login from "./assets/views/Login";

import RutaProtegida from "./assets/components/rutas/RutaProtegida";

import Pagina404 from "./assets/views/Pagina404";

import "./App.css";

const App = () => {

  return (

    <Router>

      <Encabezado />

      <main className="margen-superior-main">

        <Routes>

          {/* =========================
              Login
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =========================
              Dashboard
          ========================= */}

          <Route
            path="/"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />

          {/* =========================
              Clientes
          ========================= */}

          <Route
            path="/clientes"
            element={
              <RutaProtegida>
                <Clientes />
              </RutaProtegida>
            }
          />

          {/* =========================
              Membresías
          ========================= */}

          <Route
            path="/membresias"
            element={
              <RutaProtegida>
                <Membresias />
              </RutaProtegida>
            }
          />

          {/* =========================
              ✅ PASO 2: Nueva ruta Membresías Clientes
          ========================= */}

          <Route
            path="/membresias-clientes"
            element={
              <RutaProtegida>
                <MembresiasClientes />
              </RutaProtegida>
            }
          />

          {/* =========================
              Asistencias
          ========================= */}

          <Route
            path="/asistencias"
            element={
              <RutaProtegida>
                <Asistencias />
              </RutaProtegida>
            }
          />

          {/* =========================
              Ventas
          ========================= */}

          <Route
            path="/ventas"
            element={
              <RutaProtegida>
                <Ventas />
              </RutaProtegida>
            }
          />

          {/* =========================
              Productos
          ========================= */}

          <Route
            path="/productos"
            element={
              <RutaProtegida>
                <Productos />
              </RutaProtegida>
            }
          />

          <Route path="/catalogo" element={<Catalogo />} />

          {/* =========================
              Página no encontrada
          ========================= */}

          <Route
            path="*"
            element={<Pagina404 />}
          />

        </Routes>

      </main>

    </Router>
  );
};

export default App;
