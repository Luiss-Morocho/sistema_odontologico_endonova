import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';

function GestionUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre_completo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(formData);
      alert("¡Usuario " + formData.nombre_completo + " registrado con éxito!");
      // Limpiamos el formulario
      setFormData({ username: '', password: '', nombre_completo: '' });
    } catch (error) {
      console.error(error);
      alert("Error al registrar. Tal vez el usuario ya existe.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')}>← Volver al Inicio</button>
      
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        Panel Administrativo: Gestión de Personal
      </h2>

      <div style={{ 
          backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h3>Registrar Nuevo Usuario</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
            Utilice este formulario para dar acceso al sistema a nuevos doctores o secretarias.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
                <label>Nombre Completo:</label>
                <input 
                    type="text" 
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="Ej: Dra. María López"
                    required 
                />
            </div>

            <div>
                <label>Usuario (para iniciar sesión):</label>
                <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="Ej: maria.lopez"
                    required 
                />
            </div>

            <div>
                <label>Contraseña:</label>
                <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    placeholder="******"
                    required 
                />
            </div>

            <button type="submit" style={{ 
                backgroundColor: '#28a745', color: 'white', padding: '10px', 
                border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px'
            }}>
                Crear Usuario
            </button>
        </form>
      </div>
    </div>
  );
}

export default GestionUsuarios;