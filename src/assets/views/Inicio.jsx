import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Inicio = () => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Bienvenido a GymLiveFitness</h2>
      <p className="lead">Sistema de Analítica Inteligente para la Gestión del Gimnasio LiveFitness</p>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Clientes</h5>
              <p>Gestión y análisis de clientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Asistencias</h5>
              <p>Control y estadísticas de asistencia</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Ventas</h5>
              <p>Análisis de productos y ventas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;