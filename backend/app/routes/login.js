const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/login', loginController.login);
router.post('/logout', loginController.logout); // Utiliza el método GET para el cierre de sesión

module.exports = router;
