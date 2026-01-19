import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'; 

import Pacientes from './components/ListaPacientes'; 
import Fichas from './components/Fichas';
import Odontograma from './components/Odontograma';
import Login from './components/Login';
import GestionUsuarios from './components/GestionUsuarios';
import Dashboard from './components/Dashboard';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario_endonova');
    const usernameId = localStorage.getItem('username_id');
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
      if (usernameId === 'admin') setEsAdmin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (nombreUsuario) => {
    setUsuario(nombreUsuario);
    localStorage.setItem('usuario_endonova', nombreUsuario);
    const currentId = localStorage.getItem('username_id');
    setEsAdmin(currentId === 'admin');
  };

  const handleLogout = () => {
    setUsuario(null);
    setEsAdmin(false);
    localStorage.clear();
    window.location.href = "/"; 
  };

  if (!usuario) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
        
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow">
          <Container>
            <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold' }}>🦷 Endonova Sys</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
                <Nav.Link as={Link} to="/citas">Citas</Nav.Link> {/* NUEVO LINK */}
                
                {/* El link de Admin en el menú lo mantenemos oculto para no confundir, 
                    pero el acceso desde el Dashboard ahora mostrará la alerta */}
                {esAdmin && (<Nav.Link as={Link} to="/usuarios">Administración</Nav.Link>)}
              </Nav>
              <Nav className="align-items-center">
                <span className="text-light me-3">Dr. {usuario}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<div className="bg-white p-4 rounded shadow-sm"><Pacientes /></div>} />
            <Route path="/usuarios" element={esAdmin ? <GestionUsuarios /> : <Navigate to="/" />} />
            <Route path="/fichas/:pacienteId" element={<div className="bg-white p-4 rounded shadow-sm"><Fichas /></div>} />
            <Route path="/odontograma/:pacienteId" element={<Odontograma />} />

            {/* RUTA DE CITAS (PÁGINA EN CONSTRUCCIÓN) */}
            <Route path="/citas" element={
                <div className="text-center mt-5 p-5 bg-white rounded shadow-sm">
                    <h1 style={{fontSize: '80px'}}>🚧</h1>
                    <h2 className="text-primary">Módulo de Citas</h2>
                    <p className="lead text-muted">Esta funcionalidad se encuentra actualmente <strong>en desarrollo</strong>.</p>
                    <p>Próximamente podrá agendar y gestionar turnos desde aquí.</p>
                    <Button variant="outline-primary" as={Link} to="/">Volver al Inicio</Button>
                </div>
            } />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;