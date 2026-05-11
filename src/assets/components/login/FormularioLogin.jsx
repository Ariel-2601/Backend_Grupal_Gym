import React from 'react';
import logo from "../../../assets/logo.png";

import {
    Form,
    Button,
    Card,
    Alert
} from "react-bootstrap";

const FormularioLogin = ({
    usuario,
    contrasena,
    error,
    setUsuario,
    setContrasena,
    iniciarSesion
}) => {

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <Card className="p-4 shadow-lg border-0 rounded-4">

                        <Card.Body>

                            {/* Logo / Título */}
                            <div className="text-center mb-4">

                                <i
                                    className="bi bi-heart-pulse-fill text-danger"
                                    style={{
                                        fontSize: "4rem"
                                    }}
                                ></i>

                                <h2 className="mt-3 fw-bold color-texto-marca">

                                    GymLiveFitness

                                </h2>

                                <p className="text-muted">

                                    Sistema Inteligente de Gestión Fitness

                                </p>

                            </div>

                            {/* Error */}
                            {error && (

                                <Alert variant="danger">

                                    {error}

                                </Alert>
                            )}

                            {/* Formulario */}
                            <Form>

                                {/* Usuario */}
                                <Form.Group
                                    className="mb-3"
                                    controlId="usuario"
                                >

                                    <Form.Label>
                                        Usuario / Correo
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese su usuario"
                                        value={usuario}
                                        onChange={(e) =>
                                            setUsuario(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </Form.Group>

                                {/* Contraseña */}
                                <Form.Group
                                    className="mb-4"
                                    controlId="contrasena"
                                >

                                    <Form.Label>
                                        Contraseña
                                    </Form.Label>

                                    <Form.Control
                                        type="password"
                                        placeholder="Ingrese su contraseña"
                                        value={contrasena}
                                        onChange={(e) =>
                                            setContrasena(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </Form.Group>

                                {/* Botón */}
                                <Button
                                    variant="dark"
                                    className="w-100 py-2 fw-bold"
                                    onClick={iniciarSesion}
                                >

  <i
   src={logo}
   alt="Logo Gym"
   style={{
      width: "120px",
      height: "120px",
      objectFit: "contain"
   }}
/>

                                    Iniciar Sesión

                                </Button>

                            </Form>

                        </Card.Body>

                    </Card>

                </div>

            </div>

        </div>
    );
};

export default FormularioLogin;