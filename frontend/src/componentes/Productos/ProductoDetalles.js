import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductos } from '../../Hooks/UseProductos';

export const ProductoDetalles = () => {
    // Obtener el parámetro de la URL que corresponde al ID del producto
    const { id } = useParams();

    // Obtener la lista de productos utilizando el hook useProductos
    const { productos } = useProductos();

    // Buscar el producto con el ID correspondiente
    const producto = productos.find((item) => item.ID_Producto === Number(id));

    // Estado para el valor seleccionado del input
    const [selectedValue, setSelectedValue] = useState(1);

    // Manejar el cambio en el input
    const handleInput = (e) => {
        const value = parseInt(e.target.value);
        setSelectedValue(value);
    };

    useEffect(() => {
        // Reiniciar el valor seleccionado cuando cambia el producto
        if (producto) {
            setSelectedValue(1);
        }
    }, [producto]);

    return (
        <>
            {producto ? (
                <div className="detalles">
                    {/* Mostrar el nombre del producto */}
                    <h2>{producto.Nombre_Producto}</h2>

                    <div className="contenedorImagenDetalles">
                        {/* Mostrar la imagen del producto */}
                        <img
                            className="imagenProductodetalles"
                            src={producto[`Imagen_${selectedValue}`]}
                            alt={producto.Nombre_Producto}
                        />
                    </div>

                    <input
                        type="range" className='slider'
                        min={1}
                        max={3}
                        step={1}
                        value={selectedValue}
                        onChange={handleInput}
                    />

                    <div className='contenedorPrecioBtcarrito'>
                        {/* Mostrar el precio del producto */}
                        <p className="price">$ {producto.Precio} Cop</p>

                        <button id="btn_añadirCarrito" className="btn">
                            Añadir al carrito
                        </button>
                    </div>

                    <div className='contenedorDescripcion'>
                        {/* Mostrar la descripción del producto */}
                        <p className='detallesDescripcion'>
                            <span className='description'>Descripción: </span>
                            {producto.Descripcion}
                        </p>
                    </div>
                </div>
            ) : (
                <p className='notificacionErrorDataProducto'>Cargando producto.</p>
            )}
        </>
    );
};
