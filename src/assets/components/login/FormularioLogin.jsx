import React, { useState } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap";

const FormularioLogin = ({
    usuario,
    contrasena,
    error,
    setUsuario,
    setContrasena,
    iniciarSesion,
    logo,
    loading
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        iniciarSesion();
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">

                    <Card className="p-4 shadow-xl border-0 rounded-4 overflow-hidden">
                        <Card.Body>

                            {/* Logo y Título */}
                            <div className="text-center mb-5">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt="GymLiveFitness"
                                        className="mb-3"
                                        style={{ width: "140px", height: "auto" }}
                                    />
                                ) : (
                                    <div className="mx-auto mb-3 text-danger" style={{ fontSize: "4.5rem" }}>
                                        💪
                                    </div>
                                )}

                                <h2 className="fw-bold text-dark mb-1">GymLiveFitness</h2>
                                <p className="text-muted mb-0">
                                    Gestión Inteligente • Entrenamiento Elite
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <Alert variant="danger" className="mb-4 text-center">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">Usuario o Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="ejemplo@correo.com"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">Contraseña</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={contrasena}
                                            onChange={(e) => setContrasena(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="link"
                                            className="position-absolute end-0 top-50 translate-middle-y text-muted pe-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: "1.3rem" }}></i>
                                        </Button>
                                    </div>
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <Form.Check 
                                        type="checkbox" 
                                        label="Recordarme" 
                                        className="user-select-none"
                                    />
                                    <a href="#" className="text-decoration-none small text-primary">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>

                                <Button
                                    variant="dark"
                                    type="submit"
                                    className="w-100 py-3 fw-bold fs-5 d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right me-2" style={{ fontSize: "1.4rem" }}></i>
                                            Iniciar Sesión
                                        </>
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <small className="text-muted">
                                    ¿No tienes cuenta? <a href="#" className="text-primary fw-medium">Regístrate</a>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="text-center mt-4">
                        <small className="text-muted">© 2026 GymLiveFitness - Todos los derechos reservados</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioLogin;