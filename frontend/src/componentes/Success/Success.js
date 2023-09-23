import React, { useEffect } from "react";
import "./Success.css"
import { GrValidate } from 'react-icons/gr';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { BsFillHandThumbsUpFill } from 'react-icons/bs';

import { serverBackEndDireccion } from '../../rutas/serverback';

const URLS = `${serverBackEndDireccion()}carrito/vaciar/`;


function postOrder() {
  // Código para enviar la orden
}

function Success() {
  useEffect(() => {
    const clienteId = JSON.parse(localStorage.getItem('user'));
    const URL = `${URLS}${clienteId.ID_Usuario}`;

    fetch(URL, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Carrito vaciado:', data);
        // Aquí puedes manejar la respuesta del servidor después de vaciar el carrito
      })
      .catch(error => {
        console.error('Error al vaciar el carrito:', error);
      });
  }, []);

  return (
    <div className="successContainer">
      <div className="Success"><GrValidate className="validate"/></div>
      <h1>Compra realizada correctamente <BsFillHandThumbsUpFill className="hand"/></h1>
      <a href="/" onClick={postOrder}> Volver al inicio <BsFillArrowLeftCircleFill className="return"/></a>
    </div>
  )
}

export default Success;