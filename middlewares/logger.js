const LoggerMiddleware = (req, res, next) => {

    const fecha = new Date().toISOString()

    console.log(`${fecha} - Método: ${req.method} - Url: ${req.url} - Ip:  ${req.ip}`)

    const start = Date.now()

    res.on("finish", () => {
        const duracion = Date.now() - start
        console.log(`${fecha} - Status: ${res.statusCode} - Duracion: ${duracion}ms`)
    })

    next()
}

module.exports = LoggerMiddleware