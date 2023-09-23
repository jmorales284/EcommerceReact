import React, { useState } from "react";
import axios from "axios";
import "./profile.css";
import EditProduct from '../../componentes/Edit/Edit'

import { serverBackEndDireccion } from '../../rutas/serverback';

const URL =`${serverBackEndDireccion()}edit`;
const usuario = JSON.parse(localStorage.getItem("user"));


const AdminProfileForm = () => {
  const [originalEmail, setOriginalEmail] = useState(usuario.Email);
  const [originalPassword,] = useState(usuario.Password);
  const [originalDireccion, setOriginalDireccion] = useState(usuario.Direccion);
  const [originalTelefono, setOriginalTelefono] = useState(usuario.Telefono);
  const [name, ] = useState(usuario.Nombre);
  const [lastname,] = useState(usuario.Apellido);
  const [email, setEmail] = useState(usuario.Email);
  const [password, setPassword] = useState(usuario.Contraseña);
  const [direccion, setDireccion] = useState(usuario.Direccion);
  const [telefono, setTelefono] = useState(usuario.Telefono);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEmail(originalEmail);
    setPassword(originalPassword);
    setDireccion(originalDireccion);
    setTelefono(originalTelefono);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      Name: name,
      Lastname: lastname,
      Email: email,
      Password: password,
      Direccion: direccion,
      Telefono: telefono,
    };
    console.log(updatedProfile);
    axios
      .put(URL, updatedProfile)
      .then((response) => {
        if (response && response.data) {
          setIsEditing(false);
          setSuccessMessage(response.data.message);
          setErrorMessage("");
          setOriginalEmail(email);
          setOriginalDireccion(direccion);
          setOriginalTelefono(telefono);
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
    <div className = "registration">
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="fullName">
          
            <div className="form-group">
            <label>Informacion Personal</label>
              <label className="label">Nombre:</label>
              <input
                type="text"
                value={name}
                disabled
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="label">Apellidos:</label>
              <input
                type="text"
                value={lastname}
                disabled
                className="input"
              />
            </div>
        </div>
        <div className="form-group">
          <label className="label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={!isEditing}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            disabled={!isEditing}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={handleDireccionChange}
            disabled={!isEditing}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={handleTelefonoChange}
            disabled={!isEditing}
            className="input"
          />
        </div>
        {isEditing ? (
          <>
            <button type="submit" className="button">
              Actualizar
            </button>
            <button type="button" onClick={handleCancelClick} className="button">
              Cancelar
            </button>
          </>
        ) : (
          <button type="button" onClick={handleEditClick} className="button">
            Editar
          </button>
        )}
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <EditProduct/>
    </div>
    
  );
};

export default AdminProfileForm;
