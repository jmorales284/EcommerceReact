const Registro = require('./registro');

class Login {
  /*Función: autenticarUsuario
Objetivo: Autenticar a un usuario.

Parámetros:

Email: Correo electrónico del usuario.
Password: Contraseña del usuario.
Valor de retorno: La función devuelve el registro del usuario si la autenticación es exitosa.

Uso: Esta función se utiliza para autenticar a un usuario. Verifica si existe un registro con el correo electrónico proporcionado. 
Si no existe, se lanza un error indicando que el usuario no se encontró. 
Luego, verifica si la contraseña proporcionada coincide con la contraseña almacenada en el registro. 
Si la contraseña no coincide, se lanza un error indicando que la contraseña es incorrecta. 
Si la autenticación es exitosa, se devuelve el registro del usuario. */
  static async autenticarUsuario(Email, Password) {
    try {
      const registro = await Registro.obtenerRegistroPorEmail(Email);
      if (!registro) {
        throw new Error('User not found');
      }

      const contraseñaCorrecta = await Registro.obtenerRegistroPorPassword(Password);
      if (!contraseñaCorrecta) {
        throw new Error('Wrong password');
      }

      return registro;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Login;
