const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Ocurrio un Error Inesperado"
    const fecha = new Date().toISOString()

    console.error(`[ERROR] ${fecha} - ${statusCode} - ${message}`);

    if(err.stack) {
        console.error(err.stack); // con esto mostramos mas informacion del error
    }

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack})
    })
}

module.exports = errorHandler