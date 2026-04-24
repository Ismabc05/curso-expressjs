require("dotenv").config() 
const express = require("express")
const { PrismaClient } = require("./generated/prisma")
const prisma = new PrismaClient();
// con esta configuracion de prisma se comunoca con nuestra base de datos 
const bodyParser = require("body-parser")

const LoggerMiddleware = require("./middlewares/logger")
const ErrorHandler = require("./middlewares/errorHandler")
const errorHandler = require("./middlewares/errorHandler")
const { validateUser } = require("./utils/regex");

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(LoggerMiddleware)
app.use(ErrorHandler)


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
    const userID = req.params.id;
    res.send(`Mostar informacion del usuario con el id: ${userID}`)
});

app.get("/search", (req, res) => {
    const terms = req.query.termino || "No especificado" 
    const category = req.query.categoria || "Todas"
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
            return res.status(500).json({error : "Error con con la conexion del servidor"})
        }

        const users = JSON.parse(data)
        res.json(users)
    })
})

app.post("/users", (req, res) => {
    const newUser = req.body

    fs.readFile(userFilePath, "utf-8", (err, data) => {
        if(err) {
            return res.status(500).json({error: "Error con la base de datos"})
        }
        const users = JSON.parse(data);

        const validation = validateUser(newUser, users, false);
        if(!validation.isValid) {
            return res.status(400).json({error: validation.errors})
        }

        users.push(newUser);

        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err) {
                return res.status(500).json({error: "Error al crear el usuario"})
            }
            res.status(201).json(newUser)
        })
    })
})

app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10)
    const updateUser = req.body

    fs.readFile(userFilePath, "utf-8", (err, data) => {
        if(err) {
            return res.status(500).json({error: "Error al conectar con el servidor"})
        }
        let users = JSON.parse(data)

        const validation = validateUser(updateUser, users, true);
        if(!validation.isValid) {
            return res.status(400).json({error: validation.errors})
        }
        users = users.map((user) => {
            if(user.id === userId) {
                return {...user, ...updateUser}
            }else {
                return user
            }
        })

            fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
                if(err) {
                    return res.status(500).json({error: "Error al actualizar el usuario"})
                }
                res.json(updateUser)
            })
        })
})

app.delete("/users/:id", (req, res) => {
    const userID = parseInt(req.params.id, 10)
    fs.readFile(userFilePath, "utf-8", (err, data) => {
        if(err) {
            return res.status(500).json({error: "Error al conectarse al servidor"})
        }
        let users = JSON.parse(data)

        users = users.filter(user => user.id !== userID) // filtramos los usuarios que no coincidan con ese id

        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err) {
                return res.status(500).json({error : "Error al eliminar el usuario"})
            }
            res.status(204).send()
        })
    })
})

app.get("/error", (req, res, next) => {
    next(new Error("Error intecionado"))
});

app.get("/db-users" , async (req, res) => { //usamos async porqure necesario porque la consulta a la base de datos es asíncrona.
    try {
        const users = await prisma.user.findMany() // obtengo todos los registros de mi tabla user
        res.json(users)
    } catch (error) {
        res.status(500).json({error: "Error al comunicarse con la base de datos"})
    }
})

app.listen(PORT, () => {
    console.log("Servidor corriendo")
});