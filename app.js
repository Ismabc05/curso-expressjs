require("dotenv").config() // con esto puedo leer las variables de entorno
const express = require("express")
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.json()) // Permite leer JSON del body
app.use(bodyParser.urlencoded({ extended: true })) // Permite leer datos de formularios

// “Gracias a body-parser, los datos del body (JSON o formularios) se parsean y se convierten en objetos JavaScript accesibles en req.body.”

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
        <h1>Curso Express.js V2</h1>
        <p> Esto es una aplicaccion nodejs con expressjs</p>
        <p> Corre en el puerto ${PORT}</p>
        `);
});

app.get("/users/:id", (req, res) => {
    const userID = req.params.id; // tenemos acceso al id de la ruta gracias a params
    res.send(`Mostar informacion del usuario con el id: ${userID}`)
});

app.get("/search", (req, res) => {
    const terms = req.query.termino || "No especificado" // obtiene el valor despues  del ? en termino
    const category = req.query.categoria || "Todas" // obtiene el valor despues del ? en cateogria
    res.send(`
        <h2>Resultados de busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `)
})


app.listen(PORT, () => {
    console.log("Servidor corriendo")
});