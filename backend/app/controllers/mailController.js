const transporter = require("../models/sendMailModel");

const sendMailUser = async (req, res) => {
const {email} = req.body;
  try {
    const user = await transporter.sendMail({
      from: '"FlexStride" diego Santana',
      to: email,
      subject: "Hemos recibido correctamente tu pago ;)",
      text: "Hola, has realizado una compra en FlexStride, nos alegra que confies en nosotros. Consulta nuestra página para consultar el estado de tu envío",
    });
    console.log({ user });
    const admin = await transporter.sendMail({
      from: '"FlexStride" <Felipegb24510@gmail.com>',
      to: "adm.tiendita.react@gmail.com",
      subject: "Compra realizada ",
      text: "Hola, han realizado una compra en tu Ecommerce, por favor verifica en tu Dashboard para más información",
    });
    console.log({ admin });
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
};

module.exports = sendMailUser;
