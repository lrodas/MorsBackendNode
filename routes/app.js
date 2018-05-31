var espress = require('express');

var app = espress();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    })
})

module.exports = app;