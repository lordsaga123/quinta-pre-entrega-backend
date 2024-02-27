const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");

//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validación si el correo electrónico y la contraseña están presentes
        if (!email || !password) {
            return res.status(400).send({ error: "Correo electrónico y contraseña son requeridos" });
        }
        const usuario = await UserModel.findOne({ email: email });
        
        //Verificar existencia de usuario
        if (!usuario) {
            return res.status(404).send({ error: "Usuario no encontrado" });
        }

        const isValid = isValidPassword(password, usuario.password);
        console.log("La contraseña ingresada es válida:", isValid);

        if (!isValid) {
            return res.status(401).send({ error: "Contraseña no válida" });
        }

        // Establecer la sesión del usuario
        req.session.login = true;
        req.session.user = {
            email: usuario.email,
            age: usuario.age,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
        };

        res.redirect("/profile");
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send({ error: "Error en el inicio de sesión" });
    }
});

//Logout
// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    // Verificar si el usuario está autenticado antes de destruir la sesión
    if (req.session.login) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar la sesión:", err);
                res.status(500).send({ error: "Error al cerrar la sesión" });
            } else {
                res.redirect("/login");
            }
        });
    } else {
        // Si el usuario no estaba autenticado, simplemente redirigirlo al inicio de sesión
        res.redirect("/login");
    }
});

module.exports = router;