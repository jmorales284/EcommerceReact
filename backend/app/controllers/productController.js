const Product = require('../models/productos');

/*Función: obtenerProductos
Objetivo: Obtener una lista de productos.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función devuelve una lista de productos como respuesta JSON.

Uso: Esta función se utiliza para obtener una lista de productos. Puede filtrar los productos por categoría utilizando el parámetro de consulta 
categoriaId y obtener un producto específico utilizando el parámetro de ruta productId. */
async function obtenerProductos(req, res) {
  const categoriaId = req.query.categoriaId; // Obtener el parámetro de consulta categoriaId
  const productId = req.params.productId; // Obtener el parámetro de ruta productId
console.log(req.query.productId);
  try {
    // Utilizar categoryId, productId y cualquier otro parámetro según sea necesario
    let productos = await Product.obtenerProductos(categoriaId || null, productId);

    // Verificar el stock de cada producto
    productos = await Promise.all(productos.map(async (producto) => {
      const stock = await Product.verificarStock(producto.ID_Producto);
      return { ...producto, stock };
    }));



    res.json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }

}

/*Función: editarProducto
Objetivo: Editar la información de un producto existente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para editar la información de un producto existente. Utiliza el ID del producto proporcionado en el 
cuerpo de la solicitud para identificar el producto y actualiza sus propiedades con los nuevos valores proporcionados. */
async function editarProducto(req, res) {
  const productId = req.body.ID_Producto; // Obtener el ID del producto desde el cuerpo de la solicitud

  const { Nombre_Producto, Descripcion, Precio, Stock, Imagen_1, Imagen_2, Imagen_3, Max, Min } = req.body; // Obtener los datos del producto desde el cuerpo de la solicitud
console.log(req.body);
  try {
    // Verificar que el producto exista
    const producto = await Product.obtenerProductoPorId(productId);
    if (!producto) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Actualizar el producto
    await Product.editarProducto(productId, Nombre_Producto, Descripcion, Precio, Imagen_1, Imagen_2, Imagen_3, Stock, Max, Min);

    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*Función: eliminarProducto
Objetivo: Eliminar un producto existente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para eliminar un producto existente. Utiliza el ID del producto proporcionado en los parámetros de la 
ruta para identificar el producto y eliminarlo de la base de datos. */

async function eliminarProducto(req, res) {
  const productId = req.params.productId; // Obtener el parámetro de ruta productId
   try {
    // Verificar que el producto exista
    const producto = await Product.obtenerProductoPorId(productId);
    if (!producto) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Eliminar el producto
    await Product.eliminarProducto(productId);

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}



module.exports = { obtenerProductos , editarProducto, eliminarProducto };
