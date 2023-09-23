import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { serverBackEndDireccion } from '../../rutas/serverback';

const URL =`${serverBackEndDireccion()}login`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        Email: email,
        Password: password
      };

      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        const { usuario } = result;
        localStorage.setItem('user', JSON.stringify(usuario));
        const { accessToken } = result;
        localStorage.setItem('accessToken', accessToken);

        // Configurar mensaje de bienvenida y redirigir al inicio
        setMessage(`¡Bienvenido ${usuario.Nombre}!`);
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 4000);
      } else {
        // Configurar mensaje de error y recargar la página
        setMessage('Credenciales incorrectas, vuelve a intentarlo.');
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleForgotPassword = () => {
    console.log('Olvidé mi contraseña');
  };

  return (
    <div>
      <div className="login-container">
        {message && <p className = 'loginMessage'>{message}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
          <div className="login-form-links">
            <button type="button" className="register-button">
              <Link to="/register">Register</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
