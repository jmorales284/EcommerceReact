import { useState, useEffect } from 'react';
import { serverBackEndDireccion } from '../rutas/serverback';

// URL de la API para obtener los productos
const URL =`${serverBackEndDireccion()}products/`;

// Hook personalizado para obtener los productos
function useProductos() {
  // Estado para almacenar los productos
  const [productos, setProductos] = useState([]);

  // Obtener los productos al montar el componente
  useEffect(() => {
    // Función asincrónica para obtener los productos
    const fetchProductos = async () => {
      try {
        // Realizar la petición GET a la API
        const response = await fetch(URL);
        // Obtener los datos de la respuesta
        const data = await response.json();
        // Actualizar el estado con los productos obtenidos
        setProductos(data.productos);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    // Llamar a la función para obtener los productos
    fetchProductos();
  }, []);

  // Devolver los productos
  return { productos };
}

export { useProductos };
