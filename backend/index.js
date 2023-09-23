const express = require('express');
const cors = require('cors');
const app = express();

const port = 5000;

const products = require('./app/routes/productRoutes');
  const cart = require('./app/routes/carrito');
const registroRouter = require('./app/routes/registro');
const loginRouter = require('./app/routes/login'); // Agregado: Ruta para el login

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Parsear el cuerpo de las solicitudes como JSON

app.use(cart);
app.use(registroRouter);
app.use(loginRouter);
app.use(products);

app.listen(port, () => {
  console.log('The app is online!');
});
