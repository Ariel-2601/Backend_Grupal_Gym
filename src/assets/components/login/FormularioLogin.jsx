import React from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap";

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
        <div className="col-md-6">
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4 color-texto-marca">Iniciar Sesión</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3" controlId="usuario">
                  <Form.Label>Usuario / Correo</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingresa tu usuario" 
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contrasena">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Ingresa tu contraseña" 
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  className="w-100" 
                  onClick={iniciarSesion}
                >
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