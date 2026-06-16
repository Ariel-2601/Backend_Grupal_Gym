import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";

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
    const [focusedField, setFocusedField] = useState(null);
    const [shakeError, setShakeError] = useState(false);

    // Efecto de shake cuando hay error
    useEffect(() => {
        if (error) {
            setShakeError(true);
            const timer = setTimeout(() => setShakeError(false), 500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        iniciarSesion();
    };

    return (
        <div 
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Elementos decorativos de fondo */}
            <div 
                className="position-absolute"
                style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    top: '-100px',
                    left: '-100px',
                    filter: 'blur(40px)'
                }}
            />
            <div 
                className="position-absolute"
                style={{
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    bottom: '-150px',
                    right: '-150px',
                    filter: 'blur(60px)'
                }}
            />

            <div className="container px-3" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">

                        <Card 
                            className="border-0 shadow-2xl"
                            style={{
                                borderRadius: '24px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                transform: shakeError ? 'translateX(0)' : 'translateX(0)',
                                animation: shakeError ? 'shake 0.5s ease-in-out' : 'none'
                            }}
                        >
                            <Card.Body className="p-4 p-md-5">

                                {/* Logo y Título */}
                                <div className="text-center mb-4">
                                    <div 
                                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                                        }}
                                    >
                                        {logo ? (
                                            <img
                                                src={logo}
                                                alt="LiveFitnessGym"
                                                style={{ width: "50px", height: "auto" }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: "2.5rem", filter: 'brightness(0) invert(1)' }}>
                                                💪
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.75rem' }}>
                                        LiveFitnessGym
                                    </h2>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                        Gestión Inteligente • Entrenamiento Elite
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <Alert 
                                        variant="danger" 
                                        className="mb-4 text-center border-0"
                                        style={{
                                            borderRadius: '12px',
                                            background: 'rgba(220, 53, 69, 0.1)',
                                            color: '#dc3545',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label 
                                            className="fw-semibold text-dark mb-2"
                                            style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                        >
                                            USUARIO O CORREO
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ejemplo@correo.com"
                                            value={usuario}
                                            onChange={(e) => setUsuario(e.target.value)}
                                            onFocus={() => setFocusedField('usuario')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            autoFocus
                                            className="border-2 py-3 px-4"
                                            style={{
                                                borderRadius: '14px',
                                                borderColor: focusedField === 'usuario' ? '#667eea' : '#e9ecef',
                                                backgroundColor: focusedField === 'usuario' ? '#f8f9ff' : '#f8f9fa',
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.95rem',
                                                boxShadow: focusedField === 'usuario' ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none'
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label 
                                            className="fw-semibold text-dark mb-2"
                                            style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                        >
                                            CONTRASEÑA
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={contrasena}
                                                onChange={(e) => setContrasena(e.target.value)}
                                                onFocus={() => setFocusedField('contrasena')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className="border-2 py-3 px-4"
                                                style={{
                                                    borderRadius: '14px',
                                                    borderColor: focusedField === 'contrasena' ? '#667eea' : '#e9ecef',
                                                    backgroundColor: focusedField === 'contrasena' ? '#f8f9ff' : '#f8f9fa',
                                                    transition: 'all 0.3s ease',
                                                    fontSize: '0.95rem',
                                                    paddingRight: '50px',
                                                    boxShadow: focusedField === 'contrasena' ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none'
                                                }}
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute end-0 top-50 translate-middle-y text-muted pe-3"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ 
                                                    textDecoration: 'none',
                                                    zIndex: 10
                                                }}
                                            >
                                                <i 
                                                    className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} 
                                                    style={{ 
                                                        fontSize: "1.2rem",
                                                        color: showPassword ? '#667eea' : '#adb5bd',
                                                        transition: 'color 0.3s ease'
                                                    }}
                                                ></i>
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Form.Check 
                                            type="checkbox" 
                                            label={
                                                <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                                                    Recordarme
                                                </span>
                                            }
                                            className="user-select-none"
                                        />
                                        <a 
                                            href="#" 
                                            className="text-decoration-none fw-medium"
                                            style={{ 
                                                fontSize: '0.85rem',
                                                color: '#667eea',
                                                transition: 'color 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>

                                    <Button
                                        variant="dark"
                                        type="submit"
                                        className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                                        disabled={loading}
                                        style={{
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontSize: '1rem',
                                            letterSpacing: '0.5px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!loading) {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                <span>Iniciando sesión...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right" style={{ fontSize: "1.2rem" }}></i>
                                                <span>Iniciar Sesión</span>
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <small style={{ color: '#adb5bd', fontSize: '0.85rem' }}>
                                        ¿No tienes cuenta?{' '}
                                        <a 
                                            href="#" 
                                            className="fw-semibold text-decoration-none"
                                            style={{ 
                                                color: '#667eea',
                                                transition: 'color 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                        >
                                            Regístrate
                                        </a>
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>

                        <div className="text-center mt-4">
                            <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                © 2026 LiveFitnessGym - Todos los derechos reservados
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS para animación shake */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .shadow-2xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                }
            `}</style>
        </div>
    );
};

export default FormularioLogin;