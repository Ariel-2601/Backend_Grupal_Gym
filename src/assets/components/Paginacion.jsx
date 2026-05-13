import React from "react";
import { Pagination } from "react-bootstrap";

const Paginacion = ({
    paginaActual,
    totalPaginas,
    cambiarPagina
}) => {

    const paginas = [];

    for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(
            <Pagination.Item
                key={i}
                active={i === paginaActual}
                onClick={() => cambiarPagina(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Pagination className="justify-content-center mt-3">

            <Pagination.Prev
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
            />

            {paginas}

            <Pagination.Next
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
            />

        </Pagination>
    );
};

export default Paginacion;