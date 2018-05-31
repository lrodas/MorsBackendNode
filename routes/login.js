var espress = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var Empleado = require('../models/usuario');

var app = espress();



app.post('/', (req, res) => {

    var body = req.body;

    Empleado.findOne({ email: body.email }, (err, empleadoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empleados',
                errors: err
            });
        }

        if (!empleadoBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, empleadoBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear token
        empleadoBD.password = ':)';
        var token = jwt.sign({ usuario: empleadoBD }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            empleado: empleadoBD,
            id: empleadoBD._id,
            token: token
        });
    });
});

module.exports = app;