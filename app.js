require("dotenv").config() // con esto puedo leer las variables de entorno
const express = require("express")

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
        <h1>Curso Express.js V2</h1>
        <p> Esto es una aplicaccion nodejs con expressjs</p>
        <p> Corre en el puerto ${PORT}</p>
        `);
});


app.listen(PORT, () => {
    console.log("Servidor corriendo")
});