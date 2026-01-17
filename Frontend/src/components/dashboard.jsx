import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPacientes } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [totalPacientes, setTotalPacientes] = useState(0);

  useEffect(() => {
    const nombre = localStorage.getItem('usuario_endonova');
    if (nombre) setUsuario(nombre);
    contarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contarDatos = async () => {
    try {
      const data = await getPacientes();
      setTotalPacientes(data.length);
    } catch (error) { console.error(error); }
  };

  // --- LÓGICA DE SEGURIDAD PARA EL BOTÓN ---
  const handleAdminClick = () => {
    const rol = localStorage.getItem('username_id'); // Recuperamos quién es
    if (rol === 'admin') {
        navigate('/usuarios'); // Si es admin, pasa
    } else {
        // Si NO es admin, mostramos el mensaje de error
        alert("⛔ ACCESO DENEGADO\n\nUsted no tiene permisos de Administrador para acceder a la gestión de usuarios.");
    }
  };

  return (
    <Container className="py-4">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border border-secondary border-opacity-10">
        <Container fluid>
          <h1 className="display-5 fw-bold text-primary">¡Hola, {usuario.includes('Dr.') ? usuario : `Dr. ${usuario}`}! 👋</h1>
          <p className="col-md-8 fs-4 text-muted">
            Bienvenido al Sistema de Gestión Odontológica <strong>Endonova</strong>.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/pacientes')}>
            Ir a Pacientes
          </Button>
        </Container>
      </div>

      {/* TARJETAS KPI */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-4 border-primary h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div><h6 className="text-muted mb-1">TOTAL PACIENTES</h6><h2 className="fw-bold mb-0">{totalPacientes}</h2></div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">👤</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-4 border-success h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div><h6 className="text-muted mb-1">ESTADO DEL SISTEMA</h6><h5 className="fw-bold text-success mb-0">En Línea 🟢</h5></div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">⚙️</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 border-start border-4 border-warning h-100">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div><h6 className="text-muted mb-1">FECHA DE HOY</h6><h5 className="fw-bold mb-0">{new Date().toLocaleDateString()}</h5></div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">📅</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3 text-secondary">Accesos Directos</h4>
      <Row>
        {/* 1. PACIENTES */}
        <Col md={4}>
            <Card className="shadow-sm mb-3 h-100" style={{cursor: 'pointer'}} onClick={() => navigate('/pacientes')}>
                <Card.Body className="d-flex align-items-center">
                    <div className="bg-primary text-white p-3 rounded me-3">📂</div>
                    <div><h5 className="mb-1">Gestión de Pacientes</h5><p className="mb-0 text-muted small">Registrar, buscar y editar.</p></div>
                </Card.Body>
            </Card>
        </Col>
        
        {/* 2. CITAS (NUEVO) */}
        <Col md={4}>
            <Card className="shadow-sm mb-3 h-100" style={{cursor: 'pointer'}} onClick={() => navigate('/citas')}>
                <Card.Body className="d-flex align-items-center">
                    <div className="bg-info text-white p-3 rounded me-3">📆</div>
                    <div>
                        <h5 className="mb-1">Agenda de Citas</h5>
                        <p className="mb-0 text-danger small fw-bold">⚠️ En desarrollo...</p>
                    </div>
                </Card.Body>
            </Card>
        </Col>

        {/* 3. ADMINISTRACIÓN (CON BLOQUEO) */}
        <Col md={4}>
            <Card className="shadow-sm mb-3 h-100" style={{cursor: 'pointer'}} onClick={handleAdminClick}>
                <Card.Body className="d-flex align-items-center">
                    <div className="bg-dark text-white p-3 rounded me-3">🔐</div>
                    <div><h5 className="mb-1">Administración</h5><p className="mb-0 text-muted small">Gestionar usuarios.</p></div>
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;