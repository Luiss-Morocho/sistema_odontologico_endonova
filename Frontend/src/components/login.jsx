import { useState } from 'react';
import { loginUsuario } from '../services/api';

function Login({ onLogin }) { // Recibimos una función "onLogin" del padre
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUsuario(username, password);
      
      localStorage.setItem('username_id', username); 

      // Si el login es exitoso, avisamos a App.jsx
      onLogin(data.usuario); 
      alert("¡Bienvenido " + data.usuario + "!");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
      console.error(err);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', backgroundColor: '#f0f2f5' 
    }}>
      <div style={{ 
        padding: '40px', backgroundColor: 'white', 
        borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '300px', textAlign: 'center'
      }}>
        <h2 style={{ color: '#333' }}>Iniciar Sesión</h2>
        <h4 style={{ color: '#666', marginBottom: '20px' }}>Endonova</h4>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Usuario" 
            value={username} onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          />
          <input 
            type="password" placeholder="Contraseña" 
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
            required
          />
          
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          
          <button type="submit" style={{ 
            padding: '10px', backgroundColor: '#007bff', color: 'white', 
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;