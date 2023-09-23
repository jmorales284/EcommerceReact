import React, { useState } from "react";
import './Modal.css';

import { serverBackEndDireccion } from '../../rutas/serverback';

const URL = `${serverBackEndDireccion()}products`;


const Modal = ({ selectedProduct, setIsModalOpen }) => {
  
  const [productData, setProductData] = useState({ ...selectedProduct });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData((prevState) => ({
      ...prevState,

      [name]: value
    }));
  };

  const handleApplyChanges = () => {
    console.log('Applying changes to product:', productData);
    fetch(URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Changes applied:', data);
        // Aquí puedes manejar la respuesta del servidor después de actualizar el producto
      })
      .catch(error => {
        console.error('Error applying changes:', error);
      });
  };

  return (
    <div className="PrincipalContainerModal">
      <div className="modal">
        <div className="modalLeft">
          <h1 className="modalTitle">Actualizar información de un producto</h1>
          <p>Nombre: </p>
          <input
            type="text"
            name="Nombre_Producto"
            value={productData.Nombre_Producto}
            onChange={handleInputChange}
          />
          <p>Precio: </p>
          <input
            type="text"
            name="Precio"
            value={productData.Precio}
            onChange={handleInputChange}
          />
          <p>Stock Máximo: </p>
          <input
            type="text"
            name="Max"
            value={productData.Max}
            onChange={handleInputChange}
          />
          <p>Stock Mínimo: </p>
          <input
            type="text"
            name="Min"
            value={productData.Min}
            onChange={handleInputChange}
          />
          <p>Stock: </p>
          <input
            type="text"
            name="Stock"
            value={productData.Stock}
            onChange={handleInputChange}
          />
        </div>
        <div className="modalRight">
          <div className="modalImageContainer">
            <img src={selectedProduct.Imagen_1} alt="Product Image" />
          </div>
          <div className="modalButtonContainer">
            <button id="applyChanges" onClick={handleApplyChanges}>
              Aplicar Cambios
            </button>
            <button className="cerrarModal" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
