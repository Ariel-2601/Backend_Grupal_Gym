import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      // Aquí deberías usar supabase.auth.signInWithPassword si tienes configurado Supabase
      // Por ahora simulamos según la guía
      if (usuario && contrasena) {
        localStorage.setItem("usuario-supabase", usuario);
        navigate("/");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  // useEffect para validar si ya está autenticado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navigate("/");
    }
  }, [navigate]);

  const estiloContenedor = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFDEE9, #B5FFFC)",
    overflow: "hidden",
    padding: "20px",
  };

  return (
    <div style={estiloContenedor}>
      <FormularioLogin
        usuario={usuario}
        contrasena={contrasena}
        error={error}
        setUsuario={setUsuario}
        setContrasena={setContrasena}
        iniciarSesion={iniciarSesion}
      />
    </div>
  );
};

export default Login;