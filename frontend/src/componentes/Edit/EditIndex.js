import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { useProductos } from '../../Hooks/UseProductos';

export const ProductsAdmin = () => {
  const { productos } = useProductos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  return (
    <div className="productContainerFromTable">
      {productos.map((producto) => (
        <button
          onClick={() => openModal(producto)}
          className="tableElemet"
          key={producto.ID_Producto}
        >
          <div className="tableElemetLink">
            <div className="tableElemetId">{producto.ID_Producto}</div>
            <div className="tableElementImage">
              <img src={producto.Imagen_1} alt="" />
            </div>
            <div className="tableElemetName">{producto.Nombre_Producto}</div>
            <div className="tableElemetPrice">${producto.Precio} Cop</div>
            <div className="tableElemetMax">{producto.Max}</div>
            <div className="tableElemetMin">{producto.Min}</div>
            <div className="tableElemetStock">{producto.Stock}</div>
          </div>
        </button>
      ))}
      {isModalOpen && (
        <Modal selectedProduct={selectedProduct} setIsModalOpen={setIsModalOpen} />

      )}
    </div>
  );
};
