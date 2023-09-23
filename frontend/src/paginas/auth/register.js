import React, { useState } from "react";
import axios from "axios";
import "./registro.css";
import { useNavigate } from 'react-router-dom';
import { serverBackEndDireccion } from '../../rutas/serverback';

// URL de la API para el registro
const URL =`${serverBackEndDireccion()}register`;

const RegistrationForm = () => {
  // Estados para los campos del formulario y mensajes de éxito y error
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  // Funciones para manejar el cambio de cada campo del formulario
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {

    e.preventDefault();

    axios
      .post(URL, {
        Name: name,
        Email: email,
        Lastname: lastname,
        Password: password,
        Telefono: telefono,
        Direccion: direccion,
      })
      .then((response) => {
        if (response && response.data) {
          setSuccessMessage(response.data.message);
          setErrorMessage("");
          navigate("/login");
        } else {
          console.error('La respuesta no contiene la propiedad "data"');
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error);
          setSuccessMessage("");
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label className="label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Lastname:</label>
          <input
            type="text"
            value={lastname}
            onChange={handleLastnameChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={handleDireccionChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={handleTelefonoChange}
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Register
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RegistrationForm;