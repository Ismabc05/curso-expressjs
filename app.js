require("dotenv").config() // con esto puedo leer las variables de entorno
const express = require("express")
const bodyParser = require("body-parser")
const { checkName, checkEmail } = require("./regex");

const app = express();
app.use(bodyParser.json()) // Permite leer JSON del body
app.use(bodyParser.urlencoded({ extended: true })) // Permite leer datos de formularios
// “Gracias a body-parser, los datos del body (JSON o formularios) se parsean y se convierten en objetos JavaScript accesibles en req.body.”


const fs = require("fs");
const path = require("path")
const userFilePath = path.join(__dirname, "users.json") 


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

app.post("/login", (req, res) => {
    const usuario = req.body.usuario
    const contraseña = req.body.contraseña

    res.json({
        message: "Login recibido",
        data: usuario
    })
})

app.post("/form", (req, res) => {
    const name = req.body.nombre || "Anonimo"
    const email = req.body.email || "No especificado"
    res.json({
        message: "Datos Recibidos",
        data: {
            name,
            email
        }
    })
})

app.post("/api/data", (req, res) => {
    const data = req.body

    if(!data || Object.keys(data).length === 0) {
        return res.status(400).json({error: "No se recibieron datos"});
    }

    res.status(201).json({
        message: "Datos JSON recibidos",
        data: data
    })
})

app.get("/users", (req, res) => {
    fs.readFile(userFilePath, "utf-8", (err, data) => {
        if(err) {
            return res.status(500).json({error: "Error con conexion de datos."})
        }

        const users = JSON.parse(data);
        res.json(users)
    })
})

app.post("/users", (req, res) => {
    const newUser = req.body;

    if(!checkName(req.body.name)) {
        return res.status(500).json({error: "El nombre no cumple los requisitos"})
    }

    if(!checkEmail(req.body.email)) {
        return res.status(500).json({error: "El email no cumple los requisitos"})
    }

    fs.readFile(userFilePath, "utf-8", (err, data) => {
        if(err) {
            return res.status(500).json({error: "Error con conexion de datos"})
        }

        const users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err) {
                return res.status(500).json({error : "Error al guardar el usuario"})
            }
            res.status(201).json(newUser)
        })
    })

})


app.listen(PORT, () => {
    console.log("Servidor corriendo")
});