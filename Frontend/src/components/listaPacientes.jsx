import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Dropdown, ButtonGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListaPacientes = () => {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // <--- Estado para el buscador
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    
    const [pacienteActual, setPacienteActual] = useState({
        id: '', cedula: '', nombres: '', edad: '', domicilio: '', telefono: '', email: ''
    });
    
    const [mensaje, setMensaje] = useState(null);
    const API_URL = 'http://localhost:8000/pacientes'; 

    // --- CARGAR PACIENTES ---
    const cargarPacientes = async () => {
        try {
            const respuesta = await axios.get(`${API_URL}/`);
            setPacientes(respuesta.data);
        } catch (error) {
            console.error("Error:", error);
            setMensaje({ tipo: 'danger', texto: 'No se pudo conectar con el servidor.' });
        }
    };

    useEffect(() => {
        cargarPacientes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- LÓGICA DE FILTRADO (BUSCADOR) ---
    const pacientesFiltrados = pacientes.filter((paciente) => {
        const termino = busqueda.toLowerCase();
        // Busca coincidencias en Nombre O en Cédula
        return (
            paciente.nombres.toLowerCase().includes(termino) || 
            paciente.cedula.includes(termino)
        );
    });

    // --- MANEJO DE FORMULARIO ---
    const handleChange = (e) => {
        const value = e.target.name === 'edad' ? parseInt(e.target.value) : e.target.value;
        setPacienteActual({ ...pacienteActual, [e.target.name]: value });
    };

    const abrirCrear = () => {
        setModoEdicion(false);
        setPacienteActual({ cedula: '', nombres: '', edad: '', domicilio: '', telefono: '', email: '' });
        setMostrarModal(true);
    };

    const abrirEditar = (paciente) => {
        setModoEdicion(true);
        setPacienteActual(paciente);
        setMostrarModal(true);
    };

    // --- GUARDAR / ACTUALIZAR ---
    const guardarPaciente = async () => {
        try {
            if (modoEdicion) {
                await axios.put(`${API_URL}/${pacienteActual.id}`, pacienteActual);
                setMensaje({ tipo: 'success', texto: 'Paciente actualizado correctamente' });
            } else {
                await axios.post(`${API_URL}/`, pacienteActual);
                setMensaje({ tipo: 'success', texto: 'Paciente creado correctamente' });
            }
            setMostrarModal(false);
            cargarPacientes();
        } catch (error) {
            console.error("Error:", error);
            const errorMsg = error.response?.data?.detail || 'Error al guardar los datos';
            setMensaje({ tipo: 'danger', texto: errorMsg });
        }
    };

    // --- ELIMINAR ---
    const eliminarPaciente = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar a este paciente?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setMensaje({ tipo: 'success', texto: 'Paciente eliminado' });
                cargarPacientes();
            } catch (error) {
                console.error("Error:", error);
                setMensaje({ tipo: 'danger', texto: 'No se pudo eliminar' });
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Gestión de Pacientes</h2>
            
            {mensaje && <Alert variant={mensaje.tipo} onClose={() => setMensaje(null)} dismissible>{mensaje.texto}</Alert>}

            {/* BARRA SUPERIOR: Buscador + Botón Nuevo */}
            <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                <Button variant="primary" onClick={abrirCrear} style={{ minWidth: '160px' }}>
                    + Nuevo Paciente
                </Button>

                <InputGroup style={{ maxWidth: '400px' }}>
                    <InputGroup.Text id="icono-busqueda">🔍</InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nombre o cédula..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar"
                        aria-describedby="icono-busqueda"
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover responsive className="align-middle shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Cédula</th>
                        <th>Nombres</th>
                        <th>Edad</th>
                        <th>Domicilio</th>
                        <th>Teléfono</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientesFiltrados.length > 0 ? (
                        pacientesFiltrados.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.cedula}</td>
                                <td>{paciente.nombres}</td>
                                <td>{paciente.edad}</td>
                                <td>{paciente.domicilio}</td>
                                <td>{paciente.telefono}</td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        
                                        {/* MENÚ EXPEDIENTE */}
                                        <Dropdown as={ButtonGroup}>
                                            <Button variant="info" size="sm" className="text-white">Expediente</Button>
                                            <Dropdown.Toggle split variant="info" size="sm" className="text-white" />
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => navigate(`/fichas/${paciente.id}`)}>
                                                    📄 Ficha Médica
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/odontograma/${paciente.id}`)}>
                                                    🦷 Odontograma
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        {/* BOTONES DIRECTOS */}
                                        <Button variant="warning" size="sm" onClick={() => abrirEditar(paciente)} title="Editar">
                                            ✏️
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => eliminarPaciente(paciente.id)} title="Eliminar">
                                            🗑️
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                {busqueda ? "No se encontraron resultados para tu búsqueda." : "No hay pacientes registrados."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Formulario (Igual) */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modoEdicion ? 'Editar Paciente' : 'Nuevo Paciente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control type="text" name="cedula" value={pacienteActual.cedula} onChange={handleChange} disabled={modoEdicion} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres Completos</Form.Label>
                            <Form.Control type="text" name="nombres" value={pacienteActual.nombres} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Edad</Form.Label>
                            <Form.Control type="number" name="edad" value={pacienteActual.edad} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Domicilio</Form.Label>
                            <Form.Control type="text" name="domicilio" value={pacienteActual.domicilio} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" name="telefono" value={pacienteActual.telefono} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={pacienteActual.email || ''} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={guardarPaciente}>{modoEdicion ? 'Actualizar' : 'Guardar'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListaPacientes;