import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Table, Container, Badge, Alert } from 'react-bootstrap'; 
import { getPacienteById, getFichasByPaciente, createFicha } from '../services/api';

function Fichas() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [historial, setHistorial] = useState([]);

  // ESTADO DEL FORMULARIO COMPLETO
  const [form, setForm] = useState({
    motivo: '',
    antecedentes: '',
    causas: [], 
    dolor: {
        naturaleza: '', calidad: '', localizacion: '', duracion: '', iniciado_por: []
    },
    periapical: [],
    periodontal: { bolsa: '', movilidad: '' },
    radiografia: [],
    tratamiento: ''
  });

  // 1. CARGA DE DATOS
  const cargarDatos = async () => {
    try {
      const p = await getPacienteById(pacienteId);
      setPaciente(p);
      const h = await getFichasByPaciente(pacienteId);
      setHistorial(h);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { 
      cargarDatos(); 
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. MANEJADORES (LOGICA CHECKBOXES)
  const toggleCheck = (field, value) => {
    setForm(prev => {
        const list = prev[field];
        return {
            ...prev,
            [field]: list.includes(value) ? list.filter(item => item !== value) : [...list, value]
        };
    });
  };

  const handleDolorChange = (subfield, value) => {
    setForm(prev => ({ ...prev, dolor: { ...prev.dolor, [subfield]: value } }));
  };

  const toggleDolorCheck = (value) => {
    setForm(prev => {
        const list = prev.dolor.iniciado_por;
        const newList = list.includes(value) ? list.filter(i => i !== value) : [...list, value];
        return { ...prev, dolor: { ...prev.dolor, iniciado_por: newList } };
    });
  };

  // 3. ENVÍO DE DATOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fichaPayload = {
        paciente_id: parseInt(pacienteId),
        fecha: new Date().toISOString().split('T')[0],
        motivo_consulta: form.motivo,
        antecedentes: form.antecedentes,
        causas: form.causas.join(', '), 
        dolor_info: `Nat: ${form.dolor.naturaleza} | Cal: ${form.dolor.calidad} | Loc: ${form.dolor.localizacion} | Inicio: ${form.dolor.iniciado_por.join(', ')}`,
        zona_periapical: form.periapical.join(', '),
        bolsa_profundidad: form.periodontal.bolsa,
        movilidad: form.periodontal.movilidad,
        radiografia_camara: form.radiografia.join(', '),
        tratamiento_realizado: form.tratamiento
    };

    try {
        await createFicha(fichaPayload);
        alert("✅ Ficha guardada correctamente en el historial.");
        cargarDatos();
        // Limpiamos el form para la siguiente entrada
        setForm({
            motivo: '', antecedentes: '', causas: [], 
            dolor: { naturaleza: '', calidad: '', localizacion: '', duracion: '', iniciado_por: [] },
            periapical: [], periodontal: { bolsa: '', movilidad: '' }, radiografia: [], tratamiento: ''
        });
    } catch (error) {
        alert("Error al guardar");
        console.error(error);
    }
  };

  if (!paciente) return <div className="p-5 text-center">Cargando...</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <div>
            <h3 className="mb-0">🦷 Ficha Clínica: <span className="text-primary">{paciente.nombres}</span></h3>
            <small className="text-muted">ID Paciente: {paciente.id}</small>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/pacientes')}>← Volver al listado</Button>
      </div>

      <Row>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-primary text-white fw-bold py-3">
                📝 Nueva Evaluación Clínica
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                
                {/* SECCIÓN 1: DATOS GENERALES */}
                <div className="mb-4">
                    <h5 className="text-secondary border-bottom pb-2">1. Datos Generales de la Consulta</h5>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Motivo Principal</Form.Label>
                        <Form.Control type="text" placeholder="Ej: Dolor intenso en la muela derecha..." value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} required />
                        <Form.Text className="text-muted">Describa brevemente la razón por la que el paciente acude a consulta.</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Antecedentes (Enfermedad Actual)</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Ej: Paciente relata sensibilidad desde hace 3 días..." value={form.antecedentes} onChange={e => setForm({...form, antecedentes: e.target.value})} />
                        <Form.Text className="text-muted">Historia de la evolución del problema actual.</Form.Text>
                    </Form.Group>
                </div>

                {/* SECCIÓN 2: CAUSAS */}
                <Card className="mb-4 border-light bg-light">
                    <Card.Body>
                        <h6 className="fw-bold text-dark">2. Etiología (Causas)</h6>
                        <p className="text-muted small mb-2">Seleccione uno o varios factores que originaron la patología.</p>
                        <Row>
                            {['Caries', 'Reabsorciones', 'Tratamiento Anterior', 'Traumatismo', 'Finalidad Protética', 'Endoperiodontal', 'Otras'].map(item => (
                                <Col md={6} key={item}>
                                    <Form.Check type="checkbox" label={item} checked={form.causas.includes(item)} onChange={() => toggleCheck('causas', item)} />
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>

                {/* SECCIÓN 3: DOLOR */}
                <Card className="mb-4 border-light">
                    <Card.Body>
                        <h6 className="fw-bold text-dark">3. Evaluación del Dolor</h6>
                        <p className="text-muted small mb-3">Complete esta matriz para caracterizar la sintomatología del paciente.</p>
                        <Table bordered size="sm" responsive className="mb-0 bg-white">
                            <tbody>
                                <tr>
                                    <td className="fw-bold bg-light" style={{width: '20%'}}>Naturaleza</td>
                                    <td>
                                        {['No hay dolor', 'Leve', 'Moderado', 'Intenso'].map(opt => (
                                            <Form.Check inline key={opt} type="radio" label={opt} name="naturaleza" onChange={() => handleDolorChange('naturaleza', opt)} />
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-bold bg-light">Calidad</td>
                                    <td>
                                        {['Sordo', 'Agudo', 'Pulsátil', 'Continuo'].map(opt => (
                                            <Form.Check inline key={opt} type="radio" label={opt} name="calidad" onChange={() => handleDolorChange('calidad', opt)} />
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-bold bg-light">Localización</td>
                                    <td>
                                        {['Localizado', 'Difuso', 'Referido', 'Irradiado'].map(opt => (
                                            <Form.Check inline key={opt} type="radio" label={opt} name="localizacion" onChange={() => handleDolorChange('localizacion', opt)} />
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-bold bg-light">Iniciado por</td>
                                    <td>
                                        {['Frío', 'Calor', 'Dulces/Ácidos', 'Masticación', 'Al acostarse', 'Espontáneo'].map(opt => (
                                            <Form.Check inline key={opt} type="checkbox" label={opt} checked={form.dolor.iniciado_por.includes(opt)} onChange={() => toggleDolorCheck(opt)} />
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* SECCIÓN 4: EXAMEN FÍSICO Y RADIOGRÁFICO */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="h-100 border-light bg-light">
                            <Card.Body>
                                <h6 className="fw-bold">4. Zona Periapical</h6>
                                <p className="text-muted small">Hallazgos visuales o a la palpación en la encía.</p>
                                {['Normal', 'Tumefacción', 'Adenopatías', 'Dolor Palpación', 'Fístula', 'Flemón'].map(item => (
                                    <Form.Check key={item} type="checkbox" label={item} checked={form.periapical.includes(item)} onChange={() => toggleCheck('periapical', item)} />
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="h-100 border-light bg-light">
                            <Card.Body>
                                <h6 className="fw-bold">5. Examen Periodontal</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small mb-1">Profundidad de Bolsa (mm)</Form.Label>
                                    <Form.Control size="sm" type="text" placeholder="Ej: 3mm" value={form.periodontal.bolsa} onChange={e => setForm({...form, periodontal: {...form.periodontal, bolsa: e.target.value}})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="small mb-1">Movilidad (Grado Miller 0-3)</Form.Label>
                                    <Form.Select size="sm" value={form.periodontal.movilidad} onChange={e => setForm({...form, periodontal: {...form.periodontal, movilidad: e.target.value}})}>
                                        <option value="">Seleccione...</option>
                                        <option value="0">Grado 0 (Fisiológica)</option>
                                        <option value="1">Grado 1 (Horizontal &lt; 1mm)</option>
                                        <option value="2">Grado 2 (Horizontal &gt; 1mm)</option>
                                        <option value="3">Grado 3 (Vertical/Intrusión)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* SECCIÓN 6: RADIOGRAFÍA */}
                <Card className="mb-4 border-light">
                    <Card.Body>
                        <h6 className="fw-bold">6. Evaluación Radiográfica (Cámara y Conductos)</h6>
                        <p className="text-muted small mb-2">Marque las características observables en la radiografía periapical.</p>
                        <div className="d-flex flex-wrap gap-3">
                            {['Normal', 'Estrecha', 'Nódulos', 'Reabsorción interna', 'Calcificada', 'Amplia', 'Reabsorción externa'].map(item => (
                                <Form.Check key={item} type="checkbox" label={item} checked={form.radiografia.includes(item)} onChange={() => toggleCheck('radiografia', item)} />
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* SECCIÓN 7: TRATAMIENTO */}
                <div className="mb-4">
                    <Form.Label className="fw-bold bg-success text-white p-2 rounded w-100 d-block">
                        🛠️ 7. TRATAMIENTO REALIZADO
                    </Form.Label>
                    <Form.Control as="textarea" rows={4} 
                        placeholder="Describa el procedimiento realizado (ej: Apertura cameral, instrumentación, obturación...)" 
                        value={form.tratamiento} 
                        onChange={e => setForm({...form, tratamiento: e.target.value})} 
                        required 
                        style={{border: '2px solid #198754'}}
                    />
                    <Form.Text className="text-muted">Sea detallado con el procedimiento, medicación intraconducto y recomendaciones.</Form.Text>
                </div>

                <Button variant="success" size="lg" type="submit" className="w-100 fw-bold shadow">
                    💾 Guardar Ficha en Historial
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <Col lg={4}>
            <div className="sticky-top" style={{top: '20px'}}>
                <h5 className="mb-3 text-secondary">🗂️ Historial de Visitas</h5>
                <div style={{ maxHeight: '800px', overflowY: 'auto', paddingRight: '5px' }}>
                    {historial.length === 0 ? 
                        <Alert variant="info">Este paciente aún no tiene fichas registradas.</Alert> 
                        : 
                        historial.map(f => (
                        <Card key={f.id} className="mb-3 shadow-sm border-0">
                            <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-2">
                                <span className="fw-bold">📅 {f.fecha}</span>
                                <Badge bg="light" text="dark">ID: {f.id}</Badge>
                            </Card.Header>
                            <Card.Body className="small bg-white">
                                <div className="mb-2"><strong>Motivo:</strong> {f.motivo_consulta}</div>
                                <div className="mb-2 text-muted"><em>{f.causas}</em></div>
                                <hr className="my-2"/>
                                <div className="mb-1"><strong>Dolor:</strong> {f.dolor_info}</div>
                                <div className="mb-1"><strong>Periapical:</strong> {f.zona_periapical}</div>
                                <div className="mt-3 p-2 bg-light border-start border-4 border-success rounded">
                                    <strong className="text-success d-block mb-1">Tratamiento:</strong>
                                    {f.tratamiento_realizado}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Fichas;