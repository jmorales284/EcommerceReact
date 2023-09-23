const connection = require("../../config/database");

class Registro {
  static crearRegistro(Name ,Lastname ,Email, Password,Celphone, Address) {
    return new Promise((resolve, reject) => {
      const createUserQuery = "INSERT INTO Usuarios (Nombre,Apellido,Email,Contraseña ,Telefono,ID_ROL,Direccion) VALUES (?, ?, ?,?,?,2,?)";
      connection.query(createUserQuery, [Name,Lastname,Email,Password,Celphone,Address], (err) => {
        if (err) {
          console.error("Query Error :", err);
          return reject(err);
        }

        resolve();
      });
    });
  }

  static obtenerRegistroPorEmail(Email) {
    console.log(Email);
    return new Promise((resolve, reject) => {
      const getUserByEmailQuery = "SELECT *FROM Usuarios WHERE Email = ?";
      connection.query(getUserByEmailQuery, [Email], (err, results) => {
        if (err) {
          console.log("Error al obtener el registro por email:", err);
          console.error("Error al obtener el registro por email:", err);
          return reject(err);
        }

        if (results.length > 0) {
          console.log(results[0]);  
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }


  static obtenerRegistroPorIdq(Id) {
    console.log(Id);
    return new Promise((resolve, reject) => {
      const getUserByIdQuery = "SELECT * FROM Usuarios WHERE ID_USUARIO = ?";
      connection.query(getUserByIdQuery, [Id], (err, results) => {
        if (err) {
          console.error("Error retrieving the record by ID: ", err);
          return reject(err);
        }

        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
          
        }
      });
    });
  }
  
    

  static editarRegistro(Name ,Lastname ,Email, Password,Celphone,Address) {
    return new Promise((resolve, reject) => {
      const updateUserQuery = "UPDATE Usuarios SET Nombre = ?,Apellido = ?,Contraseña = ?,Telefono = ?,Direccion = ? WHERE Email = ?";
      connection.query(updateUserQuery, [Name,Lastname,Password,Celphone,Address,Email], (err) => {
        if (err) {
          console.error("Error al actualizar el registro:", err);
          return reject(err);
        }

        resolve();
      });
    });
  }
  //api de prueba para postman
  static obtenerRegistroPorPassword(Contraseña) {
    console.log(Contraseña);
    return new Promise((resolve, reject) => {
      const getUserByPasswordQuery = "SELECT * FROM Usuarios WHERE Contraseña = ?";
      connection.query(getUserByPasswordQuery, [Contraseña], (err, results) => {
        if (err) {
          console.error("Error retrieving the record by password: ", err);
          return reject(err);
        }

        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = Registro;
