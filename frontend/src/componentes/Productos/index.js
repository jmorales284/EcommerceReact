
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../../Hooks/UseProductos";

import { serverBackEndDireccion } from '../../rutas/serverback';

// extraer del local storage el id del cliente
const cliente = JSON.parse(localStorage.getItem('user'));

const URL = `${serverBackEndDireccion()}cart/add`;

export const ProductosLista = () => {
	// Obtener la lista de productos utilizando el hook useProductos
	const { productos } = useProductos();

    const [cartItems, setCartItems] = useState([]);

    const onAddProduct = (producto) => {
        setCartItems([...cartItems, producto]);
        sendToCart(producto, cliente?.ID_Usuario);
    };

    const sendToCart = async (producto, clienteId) => {
        try {
            const data = {
                clienteId: clienteId,
                productoId: producto.ID_Producto,
                cantidad: 1
            };
            console.log(data);

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error al enviar el carrito:', error);
        }
    };

    const handleAddToCart = (producto) => {
        if (cliente) {
            onAddProduct(producto);
        } else {
            // Redirect to login view
            window.location.href = '/login';
        }
    };

    return (
        <>
            <div className="productos">
                {productos ? (
                    productos.map((producto) => (
                        <div className="producto" key={producto.ID_Producto}>
                            <Link to={`/producto/${producto.ID_Producto}`}>
                                <div className="producto__img">
                                    <img src={producto.Imagen_1} alt="" />
                                </div>
                            </Link>
                            <div className="producto__footer">
                                <h1>{producto.Nombre_Producto}</h1>
                                <p className="price">${producto.Precio} Cop</p>
                            </div>
                            <div className="buttoms">
                                <button
                                    onClick={() => handleAddToCart(producto)}
                                    id="btn_añadirCarrito"
                                    className="btn"
                                >
                                    Añadir al carrito
                                </button>
                                <button
                                    id="btn_productoDetalles"
                                    className="btn2"
                                    onClick={() => {
                                        window.location.href = `/producto/${producto.ID_Producto}`;
                                    }}
                                >
                                    Vista
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="notificacionErrorDataProductos">
                        Cargando productos.
                    </p>
                )}
            </div>
        </>
    );
};

