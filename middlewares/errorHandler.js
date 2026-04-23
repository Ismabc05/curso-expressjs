const errorHandler = (err, req, res, next) => {

    const fecha = new Date().toISOString()
    const message = err.message || "Mensaje no encontrado"
    const statusCode = err.statusCode || 500

    console.error(`${fecha} - mensaje: ${message} - StatusCode: ${statusCode}`)

    if(err.stack){
        console.error(`Stack de error: ${err.stack}`)
    }

    res.status(statusCode).json({
        CodigoEstado: statusCode,
        mensaje: message,
        ...err(process.env.NODE_ENV === "development" && {stack : err.stack})
    })
}

module.exports = errorHandler