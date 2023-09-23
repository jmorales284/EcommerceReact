const express = require("express");
const router = express.Router();
const RegistroController = require("../controllers/registro");

router.post("/register", RegistroController.registrarUsuario);
router.put("/edit", RegistroController.editarUsuario);



module.exports = router;
