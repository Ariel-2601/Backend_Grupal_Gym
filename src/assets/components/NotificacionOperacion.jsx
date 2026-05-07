import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificacionOperacion = ({ mostrar, mensaje, tipo, onCerrar }) => {
  const [visible, setVisible] = useState(mostrar);

  // Corregido: Evitamos actualizar estado innecesariamente
  useEffect(() => {
    setVisible(mostrar);
  }, [mostrar]);

  const fechahora = () => {
    const fecha = new Date();
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${dia}-${mes}-${ano}`;
  };

  return (
    <ToastContainer position="top-center" className="p-2">
      <Toast 
        onClose={onCerrar} 
        show={visible} 
        delay={3000} 
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">
            {tipo === 'exito' ? '✅ Éxito' : 
             tipo === 'advertencia' ? '⚠️ Advertencia' : '❌ Error'}
          </strong>
          <small className="text-muted">{fechahora()}</small>
        </Toast.Header>
        <Toast.Body className={
          tipo === 'exito' ? 'text-white bg-success' : 
          tipo === 'advertencia' ? 'text-white bg-warning' : 
          'text-white bg-danger'
        }>
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificacionOperacion;