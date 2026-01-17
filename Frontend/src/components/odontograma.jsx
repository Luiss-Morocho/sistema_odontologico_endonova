import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
// IMPORTAMOS las funciones correctas
import { getPacienteById, getOdontograma, saveOdontograma } from '../services/api'; 

// --- COMPONENTE VISUAL (SVG) ---
const DienteIcon = ({ numero, estado, onClick }) => {
  let colorFill = "#ffffff"; 
  let strokeColor = "#333";
  
  if (estado === 'Caries') colorFill = "#dc3545"; 
  if (estado === 'Restauración') colorFill = "#0d6efd"; 
  if (estado === 'Endodoncia') colorFill = "#198754"; 
  if (estado === 'Ausente') { colorFill = "#212529"; strokeColor = "#212529"; } 
  if (estado === 'Corona') colorFill = "#ffc107"; 

  return (
    <div className="d-flex flex-column align-items-center m-1" style={{cursor: 'pointer'}} onClick={() => onClick(numero)}>
      <span className="small text-muted mb-1" style={{fontSize: '10px'}}>{numero}</span>
      <svg width="40" height="50" viewBox="0 0 100 120">
        <path d="M20,30 Q20,5 50,5 Q80,5 80,30 L85,80 Q85,110 50,110 Q15,110 15,80 Z" fill={colorFill} stroke={strokeColor} strokeWidth="3"/>
        <path d="M20,30 Q50,45 80,30" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.3" />
      </svg>
    </div>
  );
};

function Odontograma() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState({ nombres: 'Cargando...' });
  const [estadoDientes, setEstadoDientes] = useState({});
  const [herramienta, setHerramienta] = useState(null); 

  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const cuadrante4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38];

  // 1. CARGA DE DATOS (PACIENTE + ODONTOGRAMA GUARDADO)
  const cargarDatos = async () => {
    try {
      // A. Cargar Paciente
      const p = await getPacienteById(pacienteId);
      setPaciente(p);

      // B. Cargar Odontograma previo
      const odontoData = await getOdontograma(pacienteId);
      if (odontoData && odontoData.estado_dientes) {
          // Convertimos el texto JSON guardado de vuelta a Objeto JS
          const estadoGuardado = JSON.parse(odontoData.estado_dientes);
          
          // Si está vacío (es nuevo), inicializamos en 'Sano'
          if (Object.keys(estadoGuardado).length === 0) {
              inicializarDientes();
          } else {
              setEstadoDientes(estadoGuardado);
          }
      } else {
          inicializarDientes();
      }

    } catch (error) { 
        console.error(error);
        inicializarDientes(); // En caso de error, al menos mostrar los dientes vacíos
    }
  };

  const inicializarDientes = () => {
    const inicial = {};
    [...cuadrante1, ...cuadrante2, ...cuadrante3, ...cuadrante4].forEach(d => inicial[d] = 'Sano');
    setEstadoDientes(inicial);
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDienteClick = (numero) => {
    if (!herramienta) {
        alert("⚠️ Selecciona una herramienta primero (Ej: Caries)");
        return;
    }
    setEstadoDientes(prev => ({ ...prev, [numero]: herramienta }));
  };

  // 2. GUARDAR DATOS
  const guardarOdontogramaDB = async () => {
      try {
          // Convertimos el objeto de dientes a Texto JSON para guardarlo
          const datosParaEnviar = {
              paciente_id: parseInt(pacienteId),
              estado_dientes: JSON.stringify(estadoDientes) 
          };

          await saveOdontograma(datosParaEnviar);
          alert("✅ Odontograma guardado exitosamente en la Base de Datos");
      } catch (error) {
          console.error("Error al guardar:", error);
          alert("❌ Error al guardar. Revisa que el servicio 8002 esté corriendo.");
      }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🦷 Odontograma: <span className="text-primary">{paciente.nombres}</span></h3>
        <Button variant="outline-secondary" onClick={() => navigate('/pacientes')}>Volver</Button>
      </div>

      <Row>
        <Col md={12}>
            {/* HERRAMIENTAS */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="d-flex justify-content-center gap-3 bg-light rounded flex-wrap">
                    <span className="align-self-center fw-bold text-muted me-2">Herramientas:</span>
                    <Button variant={herramienta === 'Caries' ? 'danger' : 'outline-danger'} onClick={() => setHerramienta('Caries')}>🔴 Caries</Button>
                    <Button variant={herramienta === 'Restauración' ? 'primary' : 'outline-primary'} onClick={() => setHerramienta('Restauración')}>🔵 Restauración</Button>
                    <Button variant={herramienta === 'Endodoncia' ? 'success' : 'outline-success'} onClick={() => setHerramienta('Endodoncia')}>🟢 Endodoncia</Button>
                    <Button variant={herramienta === 'Corona' ? 'warning' : 'outline-warning'} onClick={() => setHerramienta('Corona')}>🟡 Corona</Button>
                    <Button variant={herramienta === 'Ausente' ? 'dark' : 'outline-dark'} onClick={() => setHerramienta('Ausente')}>⚫ Ausente</Button>
                    <div className="vr mx-2"></div>
                    <Button variant={herramienta === 'Sano' ? 'secondary' : 'outline-secondary'} onClick={() => setHerramienta('Sano')}>⚪ Borrador</Button>
                </Card.Body>
            </Card>

            {/* BOCA */}
            <Card className="shadow text-center p-4 border-0">
                <h5 className="text-muted mb-4">MAXILAR SUPERIOR</h5>
                <div className="d-flex justify-content-center mb-2 flex-wrap">
                    <div className="d-flex me-4 border-end pe-4">
                        {cuadrante1.map(num => <DienteIcon key={num} numero={num} estado={estadoDientes[num]} onClick={handleDienteClick} />)}
                    </div>
                    <div className="d-flex ms-4">
                        {cuadrante2.map(num => <DienteIcon key={num} numero={num} estado={estadoDientes[num]} onClick={handleDienteClick} />)}
                    </div>
                </div>

                <hr className="my-4 w-75 mx-auto" style={{borderTop: '3px dashed #ccc'}} />

                <div className="d-flex justify-content-center mt-2 flex-wrap">
                    <div className="d-flex me-4 border-end pe-4">
                        {cuadrante4.map(num => <DienteIcon key={num} numero={num} estado={estadoDientes[num]} onClick={handleDienteClick} />)}
                    </div>
                    <div className="d-flex ms-4">
                        {cuadrante3.map(num => <DienteIcon key={num} numero={num} estado={estadoDientes[num]} onClick={handleDienteClick} />)}
                    </div>
                </div>
                <h5 className="text-muted mt-4">MANDÍBULA INFERIOR</h5>
            </Card>

            <div className="text-center mt-4">
                <Button variant="primary" size="lg" onClick={guardarOdontogramaDB}>💾 Guardar Cambios</Button>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Odontograma;