const Login = require('../models/login');
const jwt = require('jsonwebtoken');
const blacklist = require('./modules/BlackList');


/*Función: login
Objetivo: Autenticar a un usuario y generar un token de acceso.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para autenticar a un usuario utilizando su dirección de correo electrónico y contraseña. Genera un token de acceso 
utilizando JWT y lo envía junto con la respuesta. */
async function login(req, res) {
  const { Email, Password } = req.body;

  try {
    const registro = await Login.autenticarUsuario(Email, Password);

    const accessToken = jwt.sign({ userId: registro.id }, 'secretKey', { expiresIn: '1h' });

    // Enviar el token de acceso junto con la respuesta
    res.json({ message: 'Log in successfully', accessToken, usuario: registro });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
/*Función: logout
Objetivo: Cerrar la sesión de un usuario y agregar el token a la lista negra.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza para cerrar la sesión de un usuario. Agrega el token de acceso proporcionado a la lista negra de tokens, 
lo que impide que sea utilizado en futuras solicitudes de autenticación. */
function logout(req, res) { // Funcion de cierre de sesión y añadir a lista negra
  const { token } = req.body;

  // Verificar si el token ya está en la lista negra
  if (blacklist.includes(token)) {
    return res.status(400).json({ error: 'Token is blacklisted' });
  }

  // Agregar el token a la lista negra
  blacklist.push(token);

  res.json({ message: 'Token added to blacklist' });
}

module.exports = { login, logout };
