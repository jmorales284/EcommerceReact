const db = require('../../config/database').promise() ;

class Pedido {

  /*Función: agregarProducto
Objetivo: Agregar un producto al carrito de un cliente.

Parámetros:

clienteId: ID del cliente.
productoId: ID del producto a agregar.
cantidad: Cantidad del producto a agregar.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para agregar un producto al carrito de un cliente. Verifica si ya hay un pedido existente para el cliente. 
Si no hay un pedido existente, se crea uno nuevo. Luego, verifica si el producto ya está en el carrito del cliente. 
Si está presente, actualiza la cantidad y el subtotal del producto. Si no está presente, agrega un nuevo detalle de pedido con la cantidad 
y el subtotal del producto.
 */
  static async agregarProducto(clienteId, productoId, cantidad) {
    try {
      const pedidoQuery = 'SELECT ID_Pedido FROM Pedidos WHERE ID_Usuario = ?';
      const [pedidoResult] = await db.query(pedidoQuery, [clienteId]);
  
      let pedidoId;
  
      if (pedidoResult.length === 0) {
        // No hay pedido existente para el cliente, crear un nuevo pedido
        pedidoId = await Pedido.asignarPedido(clienteId);
      } else {
        pedidoId = pedidoResult[0].ID_Pedido;
      }
  
      const detalleQuery = 'SELECT Cantidad, Subtotal FROM Detalle_Pedidos WHERE ID_Pedido = ? AND ID_Producto = ?';
      const [detalleResult] = await db.query(detalleQuery, [pedidoId, productoId]);
  
      if (detalleResult.length > 0) {
        // Producto existente en el carrito del cliente
        const detalle = detalleResult[0];
        const cantidadExistente = detalle.Cantidad;
        const subtotalExistente = detalle.Subtotal;
  
        const precioQuery = 'SELECT Precio FROM Productos WHERE ID_Producto = ?';
        const [precioResult] = await db.query(precioQuery, [productoId]);
  
        if (precioResult.length > 0) {
          const precio = precioResult[0].Precio;
          const nuevaCantidad = cantidadExistente + cantidad;
          const nuevoSubtotal = nuevaCantidad * precio;
  
          const updateQuery = 'UPDATE Detalle_Pedidos SET Cantidad = ?, Subtotal = ? WHERE ID_Pedido = ? AND ID_Producto = ?';
          await db.query(updateQuery, [nuevaCantidad, nuevoSubtotal, pedidoId, productoId]);
        }
      } else {
        // Nuevo producto en el carrito del cliente
        const precioQuery = 'SELECT Precio FROM Productos WHERE ID_Producto = ?';
        const [precioResult] = await db.query(precioQuery, [productoId]);
  
        if (precioResult.length > 0) {
          const precio = precioResult[0].Precio;
          const subtotal = cantidad * precio;
  
          const insertQuery = 'INSERT INTO Detalle_Pedidos (ID_Pedido, ID_Producto, Cantidad, Subtotal) VALUES (?, ?, ?, ?)';
          await db.query(insertQuery, [pedidoId, productoId, cantidad, subtotal]);
        }
      }
    } catch (error) {
      throw error;
    }
  }
  
  /*Función: asignarPedido
Objetivo: Asignar un pedido a un cliente.

Parámetros:

clienteId: ID del cliente.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para asignar un nuevo pedido a un cliente. Registra la fecha del pedido y crea una entrada en 
la tabla "Pedidos" con el ID del cliente y la fecha del pedido. */
  static async asignarPedido(clienteId) { 
    try {
      console.log('Asigning order');
      const fechaPedido = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato YYYY-MM-DD
      const insertPedidoQuery = 'INSERT INTO Pedidos (ID_Usuario, Fecha_Pedido) VALUES (?, ?)';
      await db.query(insertPedidoQuery, [clienteId, fechaPedido]);
    } catch (error) {
      throw error;
    }
  }
  
  /*Función: eliminarProductoCarrito
Objetivo: Eliminar un producto del carrito de un cliente.

Parámetros:

clienteId: ID del cliente.
productoId: ID del producto a eliminar.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para eliminar un producto específico del carrito de un cliente. 
Elimina el detalle de pedido correspondiente al producto y al cliente de la tabla "Detalle_Pedidos" */
  
  static   async   elimnarProductoCarrito(clienteId, productoId) {
    try {
      const query = 'DELETE FROM Detalle_Pedidos WHERE ID_Pedido = ? AND ID_Producto = ?';
      await db.query(query, [clienteId, productoId]);
    } catch (error) {
      throw error;
    }
  }
  
  
  /*Función: obtenerProductosPorCliente
Objetivo: Obtener los productos en el carrito de un cliente.

Parámetros:

clienteId: ID del cliente.
Valor de retorno: La función devuelve una lista de detalles de pedido con el subtotal calculado para cada producto como una respuesta JSON.

Uso: Esta función se utiliza para obtener los productos en el carrito de un cliente específico. 
Realiza una consulta que combina la tabla "Detalle_Pedidos" con la tabla "Productos" utilizando el ID del pedido. 
Calcula el subtotal para cada detalle de pedido y devuelve los detalles de pedido con el subtotal calculado. */
  static async obtenerProductosPorCliente(clienteId) {
    console.log(clienteId)
    try {
      const query = `
      SELECT Detalle_Pedidos.*, Productos.Precio, Productos.Nombre_Producto, Productos.Imagen_1
      FROM Detalle_Pedidos
      INNER JOIN Productos ON Detalle_Pedidos.ID_Producto = Productos.ID_Producto
      WHERE Detalle_Pedidos.ID_Pedido IN (
        SELECT ID_Pedido
        FROM Pedidos
        WHERE ID_Usuario = ?
      )
    `;
    //Holi
    
    const [rows] = await db.query(query, [clienteId]);
    console.log(rows);
  
      // Aquí se realiza el cálculo del subtotal para cada detalle de pedido
      const detallesPedidosConSubtotal = rows.map(detallePedido => {
        const subtotal = detallePedido.Cantidad * detallePedido.Precio;
        return {
          ...detallePedido,
          Subtotal: subtotal
        };
      });
  
      return detallesPedidosConSubtotal;
    } catch (error) {
      throw error;
    }
  }
  
  /*Función: finalizarCompra
Objetivo: Finalizar la compra de un producto.

Parámetros:

clienteId: ID del cliente.
productoId: ID del producto a eliminar del carrito.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para finalizar la compra de un producto específico. 
Elimina el detalle de pedido correspondiente al producto y al cliente de la tabla "Detalle_Pedidos". */
  static async finalizarCompra(clienteId, productoId) {
    try {
      const query = 'DELETE FROM Detalle_Pedidos WHERE ID_Pedido = ? AND ID_Producto = ?';
      await db.query(query, [clienteId, productoId]);
    } catch (error) {
      throw error;
    }
  }
  
  /*Función: vaciarCarrito
Objetivo: Vaciar el carrito de un cliente.

Parámetros:

clienteId: ID del cliente.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para vaciar el carrito de un cliente. 
Elimina todos los detalles de pedido asociados al cliente de la tabla "Detalle_Pedidos". */
  static async vaciarCarrito(clienteId) {
    try {
      const query = 'DELETE FROM Detalle_Pedidos WHERE ID_Pedido = ?';
      await db.query(query, [clienteId]);
    } catch (error) {
      throw error;
    }
  }

  //elimanr producto del carrito 
  static async eliminarProductoDelCarrito(clienteId, productoId) {
    try {
      const query = `
        DELETE FROM Detalle_Pedidos
        WHERE ID_Pedido = (
          SELECT ID_Pedido
          FROM Pedidos
          WHERE ID_Usuario = ?
        )
        AND ID_Producto = ?
      `;
      await db.query(query, [clienteId, productoId]);
      console.log('Registros eliminados correctamente.');
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      throw error;
    }
  }
  
  
}


module.exports = Pedido;
