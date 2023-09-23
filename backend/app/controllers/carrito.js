const Carrito = require('../models/carrito');
const Product = require('../models/productos');

const Stripe = require("stripe"); // Conexion con api para pasarela de pago
const stripe = new Stripe("sk_test_51NJ0FPGQf2KJU8YXKuVLHpQavgn9simTrnriCjS2beCGo4aWyENRQ5RR7gETypJpVaOdAbvmun5hSjtCWo9T5sS500v6uI8TVA");


/*
Función: agregarProductoAlCarrito
Objetivo: Agregar un producto al carrito de un cliente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza cuando un cliente desea agregar un producto a su carrito de compras.
*/
async function agregarProductoAlCarrito(req, res) {
  // Obtener los datos del cliente y producto desde el body de la solicitud
  const { clienteId, productoId, cantidad } = req.body;

  try {
    // Verificar la disponibilidad del producto (stock)
    const producto = await Product.obtenerProductoPorId(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({ error: 'Out of stock' });
    }
 
    // Agregar el producto al carrito del cliente
    await Carrito.agregarProducto(clienteId, productoId, cantidad);

    res.json({ message: ' Product added successfully ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*
Función: obtenerSubtotalCarrito
Objetivo: Calcular el subtotal del carrito de un cliente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función devuelve el subtotal del carrito como una respuesta JSON.

Uso: Esta función se utiliza para obtener el subtotal del carrito de un cliente y mostrarlo en la interfaz de usuario.
*/
async function obtenerSubtotalCarrito(req, res) {
  try {
    // Obtener el ID del cliente desde los parámetros de la solicitud
    const { clienteId } = req.params;

    // Obtener los productos en el carrito del cliente
    const productosCarrito = await Carrito.obtenerProductosPorCliente(clienteId);
 
    console.log(productosCarrito);

    // Validar si el carrito está vacío
    if (productosCarrito.length === 0) {
      return res.status(400).json({ error: 'Shopping cart is empty' });
    }

    // Calcular el subtotal sumando los subtotales de los productos
    let subtotal = 0;
    for (const producto of productosCarrito) {
      subtotal += parseFloat(producto.Subtotal);
    }

    console.log(subtotal);
    res.json({ subtotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*
Función: compraRealizada
Objetivo: Realizar una compra exitosa, vaciar el carrito y enviar correos electrónicos de confirmación.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza cuando un cliente realiza una compra exitosa. Vacía el carrito del cliente y envía correos electrónicos 
tanto al usuario como al administrador con los detalles de la compra.
*/
async function compraRealizada(req, res) {
  try {
    // Obtener el ID del cliente desde los parámetros de la solicitud
    const { clienteId } = req.params;

    // Obtener los productos en el carrito del cliente
    const productosCarrito = await Carrito.obtenerProductosPorCliente(clienteId);

    // Verificar si el carrito está vacío
    if (productosCarrito.length === 0) {
      return res.status(404).json({ error: 'Shopping cart is empty' });
    }

    let subtotal = 0;
    const productosConTotal = [];

    // Calcular el subtotal sumando los precios de los productos seleccionados
    for (const producto of productosCarrito) {
      subtotal += parseFloat(producto.Subtotal);
      productosConTotal.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad,
        subtotal: producto.Subtotal,
      });
    }

    // Crear el objeto de compra
    const compra = {
      clienteId,
      subtotal,
      productos: productosConTotal,
    }
    //enviarla a los correos 
    // Enviar el objeto de compra por email
    await Product.enviarEmailCompra(compra);

    // Vaciar el carrito del cliente
    await Carrito.vaciarCarrito(clienteId);

    res.json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}


/*
Función: checkout
Objetivo: Realizar el proceso de pago utilizando la pasarela de pago Stripe.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función devuelve el resultado de la sesión de pago de Stripe como una respuesta JSON.

Uso: Esta función se utiliza para iniciar el proceso de pago utilizando la pasarela de pago Stripe.
*/

async function checkout (req, res)  {
  const data = req.body;

  const line_items = data.line_items;
  console.log(line_items);
  
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/succes',
    cancel_url: 'http://localhost:3000/cancel',
  })
  res.json({result:session})
}


/*Función: obtenerCarritoPorCliente
Objetivo: Obtener el carrito de compras de un cliente con los productos y el total.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función devuelve los productos en el carrito y el total como una respuesta JSON.

Uso: Esta función se utiliza para obtener los productos en el carrito de un cliente junto con el total de la compra. */
async function obtenerCarritoPorCliente(req, res) {
  try {
    // Obtener el ID del cliente desde los parámetros de la solicitud
    const { clienteId } = req.params;
    
    // Obtener los productos en el carrito del cliente
    const productosCarrito = await Carrito.obtenerProductosPorCliente(clienteId);

    // Verificar si el carrito está vacío
    if (productosCarrito.length === 0) {
      return res.status(404).json({ error: 'Shopping cart is empty' });
    }

    let subtotal = 0;
    const productosConTotal = [];

    // Calcular el subtotal sumando los precios de los productos seleccionados
    for (const producto of productosCarrito) {
      // Obtener el detalle del producto
      const productoDetalle = await Product.obtenerProductoPorId(producto.ID_Producto);

      // Verificar si se pudo obtener el detalle del producto
      if (!productoDetalle || !productoDetalle.Precio) {
        return res.status(500).json({ error: 'Cannot find product info' });
      }

      const subtotalProducto = productoDetalle.Precio * producto.Cantidad;
      subtotal += subtotalProducto;

      // Agregar el producto al arreglo de productos con el subtotal
      productosConTotal.push({
        producto,
        subtotal: subtotalProducto,
      });
    }

    console.log(productosConTotal);
    res.json({ productos: productosConTotal, total: subtotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*Función: eliminarProductoDelCarrito
Objetivo: Eliminar un producto del carrito de un cliente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza cuando un cliente desea eliminar un producto de su carrito de compras. */

async function eliminarProductoDelCarrito(req, res) {
  console.log('eliminarProductoDelCarrito');
  // Obtener el ID del cliente desde los parámetros de la solicitu
  console.log(req.params);
  const { clienteId, productoId,cantidad } = req.params;

  try {
    // Eliminar el producto del carrito del cliente
   await Carrito.eliminarProductoDelCarrito(clienteId, productoId,cantidad);

    res.json({ message: 'The product was removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*Función: vaciarCarrito
Objetivo: Vaciar el carrito de un cliente.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza cuando un cliente desea vaciar por completo su carrito de compras. */
async function vaciarCarrito(req, res) {
  // Obtener el ID del cliente desde los parámetros de la solicitu
  const { clienteId } = req.params;

  try {
    // Eliminar el producto del carrito del cliente
    await Carrito.vaciarCarrito(clienteId);

    res.json({ message: 'Shopping cart was emptied' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

/*Función: finalizarCompra
Objetivo: Finalizar una compra, actualizar el stock y el estado del carrito.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza cuando un cliente desea finalizar una compra. Actualiza el stock de los productos comprados y 
el estado del carrito del cliente. */
async function finalizarCompra(req, res) {
  // Obtener el ID del cliente desde los parámetros de la solicitud
  const { clienteId } = req.params;

  try {
    // Obtener los productos en el carrito del cliente
    const productosCarrito = await Carrito.obtenerProductosPorCliente(clienteId);

    // Realizar la compra y actualizar el stock
    for (const producto of productosCarrito) {
      // Verificar nuevamente la disponibilidad del producto (por si ha cambiado mientras el cliente lo tenía en el carrito)
      const productoActualizado = await Product.obtenerProductoPorId(producto.productoId);
      if (productoActualizado.stock >= producto.cantidad) {
        // Actualizar el stock y realizar la compra
        await Product.actualizarStock(producto.productoId, producto.cantidad);
        await Carrito.finalizarCompra(clienteId, producto.productoId);
      } else {
        // Liberar los productos reservados y aumentar el stock
        await Carrito.eliminarProductoDelCarrito(clienteId, producto.productoId);
        await Product.aumentarStock(producto.productoId, producto.cantidad);
      }
    }

    res.json({ message: 'The Purchase was successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}



module.exports = { agregarProductoAlCarrito,checkout, obtenerSubtotalCarrito, finalizarCompra, obtenerCarritoPorCliente, eliminarProductoDelCarrito,vaciarCarrito };

