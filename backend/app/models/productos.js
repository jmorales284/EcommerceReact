const db = require('../../config/database').promise() ;
const nodemailer = require('nodemailer');

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'd.santana@utp.edu.co',
    pass: 'password'
  }
});

class Product {
  /*Función: crearProducto
Objetivo: Crear un nuevo producto.

Parámetros:

name: Nombre del producto.
description: Descripción del producto.
price: Precio del producto.
image1: URL de la imagen 1 del producto.
image2: URL de la imagen 2 del producto.
image3: URL de la imagen 3 del producto.
max: Valor máximo del producto.
min: Valor mínimo del producto.
stock: Stock del producto.
Valor de retorno: La función devuelve el ID del producto creado.

Uso: Esta función se utiliza para crear un nuevo producto en la base de datos. 
Toma los parámetros necesarios, realiza una consulta de inserción en la tabla de productos y devuelve el ID del producto creado. */
  static async crearProducto(name, description, price, image1, image2, image3, max, min, stock) {
    try {
      const query = 'INSERT INTO Productos (Nombre_Producto, Descripci0n, Precio, `Imagen_1`, `Imagen_2`, `Imagen_3`, Max, Min, Stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [result] = await db.query(query, [name, description, price, image1, image2, image3, max, min, stock]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
/*Función: editarProducto
Objetivo: Editar un producto existente.

Parámetros:

productoId: ID del producto a editar.
name: Nuevo nombre del producto.
description: Nueva descripción del producto.
price: Nuevo precio del producto.
image1: Nueva URL de la imagen 1 del producto.
image2: Nueva URL de la imagen 2 del producto.
image3: Nueva URL de la imagen 3 del producto.
stock: Nuevo stock del producto.
max: Nuevo valor máximo del producto.
min: Nuevo valor mínimo del producto.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para editar un producto existente en la base de datos. 
Toma los parámetros necesarios y realiza una consulta de actualización en la tabla de productos 
para modificar los campos correspondientes del producto con el ID proporcionado. */
  static async editarProducto(productoId, name, description, price, image1, image2, image3, stock, max, min) {
    try {
      const query = 'UPDATE Productos SET Nombre_Producto = ?, Descripcion = ?, Precio = ?, Imagen_1 = ?, Imagen_2 = ?, Imagen_3 = ?, Stock = ?, Max = ?, Min = ? WHERE ID_Producto = ?';
      await db.query(query, [name, description, price, image1, image2, image3, stock, max, min, productoId]);
    } catch (error) {
      throw error;
    }
  }
  
 /*Función: eliminarProducto
Objetivo: Eliminar un producto existente.

Parámetros:

productoId: ID del producto a eliminar.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para eliminar un producto existente de la base de datos. 
Toma el ID del producto y realiza una consulta de eliminación en la tabla de productos. */
  static async eliminarProducto(productoId) {
    try {
      const query = 'DELETE FROM Productos WHERE ID_Producto = ?';
      await db.query(query, [productoId]);
    } catch (error) {
      throw error;
    }
  }
  
/*Función: obtenerProductos
Objetivo: Obtener una lista de productos.

Parámetros:

categoriaId (opcional): ID de la categoría de productos para filtrar la lista.
Valor de retorno: La función devuelve una lista de productos.

Uso: Esta función se utiliza para obtener una lista de productos de la base de datos. 
Si se proporciona un ID de categoría, se filtran los productos por esa categoría. 
Realiza una consulta en la tabla de productos y devuelve los resultados obtenidos. */
  static async obtenerProductos(categoriaId) {
    try {
      let query = 'SELECT * FROM Productos';

      if (categoriaId) {
        query += ' WHERE categoria_id = ?';
      }

      const params = categoriaId ? [categoriaId] : [];

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  /*
  Función: obtenerProductoPorId
Objetivo: Obtener los detalles de un producto por su ID.

Parámetros:

productoId: ID del producto.
Valor de retorno: La función devuelve los detalles del producto.

Uso: Esta función se utiliza para obtener los detalles de un producto específico por su ID. 
Realiza una consulta en la tabla de productos utilizando el ID proporcionado y devuelve los resultados obtenidos.*/
  static async obtenerProductoPorId(productoId) {
    try {
      const query = 'SELECT * FROM Productos WHERE ID_Producto = ?';
      const [rows] = await db.query(query, [productoId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
/*Función: verificarStock
Objetivo: Verificar el stock de un producto y enviar una alerta si está fuera de stock.

Parámetros:

productoId: ID del producto.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para verificar el stock de un producto específico por su ID. 
Realiza una consulta en la tabla de productos y obtiene el stock y el valor mínimo permitido del producto. 
Si el stock es menor que el valor mínimo, se envía una alerta por correo electrónico.
 */
  static async verificarStock(productoId) {
    try {
      const query = 'SELECT Stock ,Min FROM Productos WHERE ID_Producto = ?';
      const [result] = await db.query(query, [productoId]);
      const stock = result[0].Stock;
      const Min = result[0].Min;

      if (stock < Min) {
        console.log(`¡Stock alert! Product's ID ${productoId} out of stock.`);

        // Configurar el contenido del correo
        const mailOptions = {
          from: 'dsantanafernandez@gmail.com',
          to: 'd.santana@utp.edu.co',
          subject: 'Stock alert',
          text: `¡Stock alert! Product's ID ${productoId} out of stock.`
        };

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Can\'t send email. Error:', error);
          } else {
            console.log('Invalid email:', info.response);
          }
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /*Función: enviarEmailCompra
Objetivo: Enviar un correo electrónico de confirmación de compra al usuario.

Parámetros:

productoId: ID del producto comprado.
userEmail: Correo electrónico del usuario.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para enviar un correo electrónico de confirmación de compra al usuario después de realizar una compra. 
Realiza una consulta en la tabla de productos utilizando el ID proporcionado para obtener los detalles del producto. 
Luego, configura el contenido del correo electrónico y lo envía al correo electrónico del usuario. */
  static async enviarEmailCompra(productoId,userEmail) {
    try {
      const query = 'SELECT * FROM Productos WHERE ID_Producto = ?';
      const [rows] = await db.query(query, [productoId]);
      const producto = rows[0];

      // Configurar el contenido del correo
      const mailOptions = {
        from: 'dsantanafernandez@gmail.com',
        to: userEmail,
        subject: 'Compra realizada',
        text: `¡Gracias por su compra! \n\n
        Detalles de la compra: \n
        '//productos comprados' \n
        Nombre: ${producto.Nombre_Producto} \n
        Descripción: ${producto.Descripcion} \n
        Precio: ${producto.Precio} \n
        Imagen: ${producto.Imagen_1} \n
        Imagen: ${producto.Imagen_2} \n
        Imagen: ${producto.Imagen_3} \n
        Stock: ${producto.Stock} \n
        Max: ${producto.Max} \n
        Min: ${producto.Min} \n
        `

      };

      // Enviar el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Can\'t send email. Error:', error);
        } else {
          console.log('Invalid email:', info.response);
        }
      }
      );
    } catch (error) {
      throw error;
    }
  }

  /*Función: enviarEmailCompraAdmin
Objetivo: Enviar un correo electrónico de confirmación de compra al administrador.

Parámetros:

productoId: ID del producto comprado.
admin: Correo electrónico del administrador.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para enviar un correo electrónico de confirmación de compra al administrador después de que un usuario realice una compra. 
Realiza una consulta en la tabla de productos utilizando el ID proporcionado para obtener los detalles del producto. 
Luego, configura el contenido del correo electrónico y lo envía al correo electrónico del administrador. */
  static async enviarEmailCompraAdmin(productoId,admin) {
    try {
      const query = 'SELECT * FROM Productos WHERE ID_Producto = ?';
      const [rows] = await db.query(query, [productoId]);
      const producto = rows[0];

      // Configurar el contenido del correo
      const mailOptions = {
        from: 'd.santana@utp.edu.co',
        to: admin ,
        subject: 'Compra realizada',
        text: `¡Gracias por su compra! \n\n
        Detalles de la compra: \n
        '//productos comprados' \n
        Nombre: ${producto.Nombre_Producto} \n
        Descripción: ${producto.Descripcion} \n
        Precio: ${producto.Precio} \n
        Imagen: ${producto.Imagen_1} \n
        Imagen: ${producto.Imagen_2} \n
        Imagen: ${producto.Imagen_3} \n
        Stock: ${producto.Stock} \n
        Max: ${producto.Max} \n
        Min: ${producto.Min} \n
        `
      };

      // Enviar el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Can\'t send email. Error:', error);
        } else {
          console.log('Invalid email:', info.response);
        }
      }
      );
    } catch (error) {
      throw error;
    }
  }





        
}

module.exports = Product;
