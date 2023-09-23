
import React, { useState, useEffect } from 'react';
import './cart.css';
import axios from 'axios';
import ImageEmpty from '../../acces/pngwing.com.png';
import { useCart } from '../../context/cart';
import { clear } from '@testing-library/user-event/dist/clear';

import { serverBackEndDireccion } from '../../rutas/serverback';


const URL =`${serverBackEndDireccion()}`;


const Cart = () => {
  const [items, setItems] = useState([]);
  const clienteId = JSON.parse(localStorage.getItem('user'))?.ID_Usuario;
  const cart = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${URL}${clienteId}`);
        const data = await response.json();
        setItems(data.productos);
      } catch (error) {
        console.error('Error al obtener los artículos del carrito:', error);
      }
    };

    if (clienteId) {
      fetchCartItems();
    }
  }, [clienteId]);

  const handleButtonPress = async () => {
    const formData = {
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Nombre del producto', // Asegúrate de proporcionar el nombre del producto aquí
              description: 'Cobro por productos en el carrito',
            },
            currency: 'COP',
            unit_amount: calculateSubtotal()
          },
          quantity: 1
        }
      ]
    };
    

    try {
      axios.post(`${URL}checkout`, formData)
        .then((res) => {
          console.log(res.data.result);
          if (res.data.result) {
            window.location.href = res.data.result.url;
          }
        });
    } catch (error) {
      console.error(error);
    }
  };


  const addItemToCart = (producto) => {
    cart.changeCart(producto, 1);
  };

  const decreaseItemQuantity = (producto) => {
    cart.changeCart(producto, -1);
  };


  

  const removeItemFromCart = (ID_Producto) => {
    
    cart.removeItem(ID_Producto);
    setItems(cart.cart.productos);
  };

  const clearCart = () => {
    setItems([]);
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    cart?.cart?.productos?.forEach((item) => {
      subtotal += item.producto.Precio * item.producto.Cantidad;
    });
    return subtotal;
  };

  return (
    <div className="cart">
      {cart?.cart?.productos.length === 0 ? (
        <div className="cart__empty">
          <img src={ImageEmpty} alt="Carrito vacío" />
          <p>No hay artículos en el carrito.</p>
        </div>
      ) : (
        <>
          <ul className="cart__list">
            {cart.cart?.productos.map((item, index) => (
              <li key={index} className="cart__item">
                <div className="cart__item-thumbnail">
                  <img src={item.producto.Imagen} alt="Producto" />
                </div>
                <div className="cart__item-info">
                  <div className="cart__item-details">
                    <label className="cart__item-name">{item.producto.Nombre}</label>
                    <button
                      className="cart__item-remove"
                      onClick={() => removeItemFromCart(item.producto.ID_Producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="cart__item-quantity">
                    <button
                      className="cart__item-button"
                      onClick={() => decreaseItemQuantity(item.producto)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="cart__item-quantity-value"
                      value={item.producto.Cantidad}
                      readOnly
                    />
                    <button
                      className="cart__item-button"
                      onClick={() => addItemToCart(item.producto)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart__subtotal">
            Subtotal: ${calculateSubtotal()}
          </div>
          <div className="cart__buttons">
            <button className="cart__buy-button" onClick={handleButtonPress}>Comprar</button>
            <button className="cart_clear cart_clear--red" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;