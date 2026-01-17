import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Form, InputGroup, Card, Badge } from 'react-bootstrap'; 
import { getPacientes, createPaciente } from '../services/api';

function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState(""); 
  const navigate = useNavigate();

  // Estado actualizado con CEDULA
  const [nuevoPaciente, setNuevoPaciente] = useState({
    cedula: '', 
    nombres: '', 
    edad: '', 
    domicilio: '', 
    telefono: '', 
    email: ''
  });

  // 1. DEFINIMOS LA FUNCIÓN PRIMERO
  const cargarPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  // 2. LUEGO USAMOS EL EFECTO
  useEffect(() => {
    cargarPacientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuardar = async () => {
    // Validaciones básicas
    if (!nuevoPaciente.cedula || !nuevoPaciente.nombres) {
        alert("⚠️ La Cédula y el Nombre son obligatorios");
        return;
    }
    
    try {
        await createPaciente(nuevoPaciente);
        alert("✅ Paciente registrado con éxito");
        // Limpiar formulario
        setNuevoPaciente({ cedula: '', nombres: '', edad: '', domicilio: '', telefono: '', email: '' });
        cargarPacientes(); 
    } catch (error) {
        alert("❌ Error: Es posible que la cédula ya esté registrada.");
        console.error(error);
    }
  };

  // LÓGICA DE FILTRADO (Por Nombre O por Cédula)
  const pacientesFiltrados = pacientes.filter(p => 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.cedula.includes(busqueda)
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="text-primary m-0">Gestión de Pacientes</h2>
        <Badge bg="secondary">Total: {pacientes.length}</Badge>
      </div>

      {/* 1. FORMULARIO DE REGISTRO */}
      <Card className="mb-4 shadow-sm bg-white border-0">
        <Card.Header className="bg-light fw-bold">👤 Nuevo Paciente</Card.Header>
        <Card.Body>
            <div className="d-flex gap-2 flex-wrap align-items-end">
                <Form.Group style={{flex: 1, minWidth: '150px'}}>
                    <Form.Label className="small text-muted mb-1">Cédula *</Form.Label>
                    <Form.Control 
                        placeholder="Ej: 172..." 
                        value={nuevoPaciente.cedula} 
                        onChange={e => setNuevoPaciente({...nuevoPaciente, cedula: e.target.value})}
                    />
                </Form.Group>

                <Form.Group style={{flex: 2, minWidth: '200px'}}>
                    <Form.Label className="small text-muted mb-1">Nombres Completos *</Form.Label>
                    <Form.Control 
                        placeholder="Ej: Juan Perez" 
                        value={nuevoPaciente.nombres} 
                        onChange={e => setNuevoPaciente({...nuevoPaciente, nombres: e.target.value})}
                    />
                </Form.Group>

                <Form.Group style={{flex: 0.5, minWidth: '80px'}}>
                    <Form.Label className="small text-muted mb-1">Edad</Form.Label>
                    <Form.Control 
                        type="number"
                        value={nuevoPaciente.edad} 
                        onChange={e => setNuevoPaciente({...nuevoPaciente, edad: e.target.value})}
                    />
                </Form.Group>

                <Form.Group style={{flex: 1, minWidth: '150px'}}>
                    <Form.Label className="small text-muted mb-1">Teléfono</Form.Label>
                    <Form.Control 
                        value={nuevoPaciente.telefono} 
                        onChange={e => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})}
                    />
                </Form.Group>

                <Form.Group style={{flex: 1, minWidth: '150px'}}>
                    <Form.Label className="small text-muted mb-1">Email</Form.Label>
                    <Form.Control 
                        type="email"
                        value={nuevoPaciente.email} 
                        onChange={e => setNuevoPaciente({...nuevoPaciente, email: e.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleGuardar} style={{height: '38px'}}>Guardar</Button>
            </div>
            <Form.Text className="text-muted">
                * La cédula debe ser única para cada paciente.
            </Form.Text>
        </Card.Body>
      </Card>

      {/* 2. BUSCADOR */}
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1" className="bg-white border-end-0">🔍</InputGroup.Text>
        <Form.Control
          placeholder="Buscar por Cédula o Nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border-start-0"
        />
      </InputGroup>

      {/* 3. TABLA DE RESULTADOS */}
      <Card className="shadow-sm border-0">
        <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light text-secondary">
            <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Edad</th>
                <th>Contacto</th>
                <th className="text-center">Expediente</th>
            </tr>
            </thead>
            <tbody>
            {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente) => (
                    <tr key={paciente.id}>
                    <td className="fw-bold text-dark">{paciente.cedula}</td>
                    <td>{paciente.nombres}</td>
                    <td>{paciente.edad} años</td>
                    <td>
                        <div className="small">{paciente.telefono}</div>
                        <div className="small text-muted">{paciente.email}</div>
                    </td>
                    <td className="text-center">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="me-2 shadow-sm"
                            onClick={() => navigate(`/fichas/${paciente.id}`)}
                        >
                            📂 Ficha
                        </Button>
                        <Button 
                            variant="info" 
                            size="sm"
                            className="text-white shadow-sm"
                            onClick={() => navigate(`/odontograma/${paciente.id}`)}
                        >
                            🦷 Odontograma
                        </Button>
                    </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                        {busqueda ? "No se encontraron coincidencias." : "Aún no hay pacientes registrados."}
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default ListaPacientes;