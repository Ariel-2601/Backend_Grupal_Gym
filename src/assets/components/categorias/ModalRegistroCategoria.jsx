import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalRegistroCategoria = ({ mostrar, setMostrar, agregarCategoria, deshabilitado }) => {
    
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre_categoria: '',
        descripcion_categoria: ''
    });

    const handleChange = (e) => {
        setNuevaCategoria({
            ...nuevaCategoria,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        await agregarCategoria(nuevaCategoria);
        // El modal se cierra desde el padre después de éxito
    };

    const handleCerrar = () => {
        setNuevaCategoria({ nombre_categoria: '', descripcion_categoria: '' });
        setMostrar(false);
    };

    return (
        <Modal 
            show={mostrar} 
            onHide={handleCerrar} 
            backdrop="static" 
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Categoría</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de la Categoría</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nombre_categoria"
                            placeholder="Ingresa el nombre"
                            value={nuevaCategoria.nombre_categoria}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            name="descripcion_categoria"
                            placeholder="Ingresa la descripción"
                            value={nuevaCategoria.descripcion_categoria}
                            onChange={handleChange}
                            disabled={deshabilitado}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCerrar} disabled={deshabilitado}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={deshabilitado || !nuevaCategoria.nombre_categoria.trim()}
                >
                    {deshabilitado ? 'Guardando...' : 'Guardar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCategoria;