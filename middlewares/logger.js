// vamos a crear un logger, que es un middleware que se encarga de guardar informacion de la solicitud antes de que enviamos la respuesta
const LoggerMiddleware = (req, res, next) => {
    const fecha = new Date().toISOString();

    console.log(`[${fecha} ${req.method} ${req.url} - IP_ ${req.ip}]`)

    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start
        console.log(`[${fecha}] Response: ${res.statusCode} - ${duration}ms`)
    })

    next()
}

module.exports = LoggerMiddleware;