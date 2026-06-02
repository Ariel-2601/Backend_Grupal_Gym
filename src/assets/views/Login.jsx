import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormularioLogin from "../components/login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";
import logo from "../../assets/logo.png";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const iniciarSesion = async () => {
        try {
            setError(null);
            setLoading(true);

            const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
                email: usuario,
                password: contrasena,
            });

            if (supabaseError) {
                setError(supabaseError.message);
                return;
            }

            localStorage.setItem("usuario-supabase", data.user.email);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("usuario-supabase")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e2937 100%)",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Fondo decorativo sutil */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 20%, rgba(234, 179, 8, 0.08), transparent 50%)",
                zIndex: 1
            }} />

            <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
                <FormularioLogin
                    usuario={usuario}
                    contrasena={contrasena}
                    error={error}
                    setUsuario={setUsuario}
                    setContrasena={setContrasena}
                    iniciarSesion={iniciarSesion}
                    logo={logo}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Login;