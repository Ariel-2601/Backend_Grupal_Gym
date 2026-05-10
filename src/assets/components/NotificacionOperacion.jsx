import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';

const NotificacionOperacion = ({ 
    mostrar, 
    mensaje, 
    tipo = "info", 
    onCerrar 
}) => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(mostrar);
    }, [mostrar]);

    const getConfig = () => {
        switch(tipo) {
            case 'success':
                return { bg: 'success', icon: '✅', title: 'Éxito' };
            case 'warning':
                return { bg: 'warning', icon: '⚠️', title: 'Advertencia' };
            case 'danger':
                return { bg: 'danger', icon: '❌', title: 'Error' };
            default:
                return { bg: 'info', icon: 'ℹ️', title: 'Información' };
        }
    };

    const { bg, icon, title } = getConfig();

    return (
        <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
            <Toast 
                show={visible} 
                onClose={onCerrar} 
                delay={4000} 
                autohide
                bg={bg}
            >
                <Toast.Header className="text-white">
                    <strong className="me-auto">{icon} {title}</strong>
                    <small>Ahora</small>
                </Toast.Header>
                <Toast.Body className="text-white">
                    {mensaje}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default NotificacionOperacion;