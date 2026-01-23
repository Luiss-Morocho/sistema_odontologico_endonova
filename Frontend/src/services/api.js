import axios from 'axios';

const API_PACIENTES = 'http://127.0.0.1:8000';
const API_FICHAS = 'http://127.0.0.1:8001';
const API_ODONTOGRAMA = 'http://127.0.0.1:8002';

// --- PACIENTES ---
export const getPacientes = async() => {
    const response = await axios.get(`${API_PACIENTES}/pacientes/`);
    return response.data;
};

export const createPaciente = async(paciente) => {
    const response = await axios.post(`${API_PACIENTES}/pacientes/`, paciente);
    return response.data;
};

export const getPacienteById = async(id) => {
    const response = await axios.get(`${API_PACIENTES}/pacientes/${id}`);
    return response.data;
};

// --- FICHAS CLÍNICAS (NUEVO) ---
export const getFichasByPaciente = async(pacienteId) => {
    const response = await axios.get(`${API_FICHAS}/fichas/${pacienteId}`);
    return response.data;
};

export const createFicha = async(ficha) => {
    const response = await axios.post(`${API_FICHAS}/fichas/`, ficha);
    return response.data;
};

export const deleteFicha = async(id) => {
    const response = await axios.delete(`${API_FICHAS}/fichas/${id}`);
    return response.data;
};

// --- ODONTOGRAMA (Puerto 8002) ---
export const getOdontograma = async(pacienteId) => {
    const response = await axios.get(`${API_ODONTOGRAMA}/odontograma/${pacienteId}`);
    return response.data;
};

export const saveOdontograma = async(datos) => {
    // datos debe tener: { paciente_id: 1, estado_dientes: "..." }
    const response = await axios.post(`${API_ODONTOGRAMA}/odontograma/`, datos);
    return response.data;
};

// --- AUTENTICACIÓN (Puerto 8003) ---
const API_AUTH = 'http://127.0.0.1:8003';

export const loginUsuario = async(username, password) => {
    // Enviamos los datos como POST
    const response = await axios.post(`${API_AUTH}/login/`, {
        username: username,
        password: password
    });
    return response.data;
};


export const registrarUsuario = async(usuarioData) => {
    // usuarioData debe tener: username, password, nombre_completo
    const response = await axios.post(`${API_AUTH}/registrar/`, usuarioData);
    return response.data;
};