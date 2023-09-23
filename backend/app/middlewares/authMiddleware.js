/*Función: verifyToken
Objetivo: Verificar y validar un token de acceso.

Parámetros:

req: Objeto de solicitud HTTP.
res: Objeto de respuesta HTTP.
next: Función de llamada de siguiente middleware o controlador.
Valor de retorno: La función no devuelve ningún valor.

Uso: Esta función se utiliza como middleware para verificar y validar un token de acceso. Extrae el token de acceso del encabezado de la solicitud y 
verifica si está en la lista negra. Si el token no está en la lista negra, utiliza jwt.verify() para verificar y decodificar el token utilizando 
una clave secreta. Si el token es válido, almacena el ID de usuario en la solicitud para su uso posterior y pasa al siguiente middleware o controlador. 
Si el token es inválido, responde al cliente con un mensaje de error. */
function verifyToken(req, res, next) {
    const token = req.headers.authorization; // Obtén el token de acceso del encabezado de la solicitud
  
    // Verificar si el token está en la lista negra
    if (blacklist.includes(token)) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
  
    // Verificar y validar el token de acceso utilizando jwt.verify()
    try {
      const decoded = jwt.verify(token, 'secretKey'); // Verifica y decodifica el token utilizando la clave secreta
      req.userId = decoded.userId; // Almacena el ID de usuario en la solicitud para su uso posterior
      next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
  }
  
  module.exports = verifyToken;
  