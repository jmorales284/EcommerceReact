import React, { createContext, useState, useEffect } from "react";
import Data from "../context/Data";

export const DataContext = createContext();

export const DataProvider = (props) => {
    // Estado para almacenar los productos
    const [productos, setProductos] = useState([]);
    // Estado para almacenar los elementos en el carrito de compras
    const [carrito, setCarrito] = useState([]);
    // Estado para almacenar el total del carrito de compras
    const [total, setTotal] = useState(0);

    // Cargar los productos al montar el componente
    useEffect(() => {
        const producto = Data.items;
        if (producto) {
            setProductos(producto);
        } else {
            setProductos([]);
        }
    }, []);

    // Agregar un producto al carrito de compras
    const addCarrito = (id) => {
        // Verificar si el producto ya está en el carrito
        const check = carrito.every(item => {
            return item.id !== id;
        });
        if (check) {
            // Obtener el producto seleccionado
            const data = productos.filter(producto => {
                return producto.id === id;
            });
            // Agregar el producto al carrito
            setCarrito([...carrito, ...data]);
        } else {
            alert("El producto se ha añadido al carrito");
        }
    };

    // Remover un producto del carrito de compras
    const removeCarrito = (id) => {
        // Filtrar los elementos del carrito, excluyendo el producto con el ID especificado
        setCarrito(carrito.filter(item => item.id !== id));
    };

    // Calcular el total del carrito de compras al modificar el carrito
    useEffect(() => {
        // Guardar los elementos del carrito en el almacenamiento local
        localStorage.setItem('dataCarrito', JSON.stringify(carrito));
        // Calcular el total sumando los precios de los productos en el carrito
        const total = carrito.reduce((prev, item) => {
            return prev + item.price;
        }, 0);
        setTotal(total);
    }, [carrito]);

    return (
        // Proporcionar los valores del contexto a los componentes hijos
        <DataContext.Provider value={{ productos, carrito, addCarrito, removeCarrito, total }}>
            {props.children}
        </DataContext.Provider>
    );
};
