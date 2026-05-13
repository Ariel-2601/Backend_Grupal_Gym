import React from "react";
import { Form } from "react-bootstrap";

const CuadroBusquedas = ({
    textoBusqueda,
    onChange
}) => {

    return (
        <Form className="mb-3">
            <Form.Control
                type="text"
                placeholder="Buscar categoría por nombre o descripción..."
                value={textoBusqueda}
                onChange={onChange}
            />
        </Form>
    );
};

export default CuadroBusquedas;