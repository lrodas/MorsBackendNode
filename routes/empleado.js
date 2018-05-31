var espress = require('express');
var bcrypt = require('bcryptjs');
var Empleado = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = espress();



// =====================================
// Obtener todos los usuarios
// =====================================
app.get('/', (req, res, next) => {

    Empleado.find({}, 'nombres apellidos img role estado').exec((err, empleados) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando empleados',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            empleados: empleados
        });
    });
});

// =====================================
// Actualizar usuario
// =====================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Empleado.findById(id, (err, empleado) => {
        var body = req.body;

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empleados',
                errors: err
            });
        }

        if (!empleado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el id especificado' }
            });
        }

        empleado.nombres = body.nombres;
        empleado.apellidos = body.apellidos;
        empleado.email = body.email;
        empleado.role = body.role;
        empleado.estado = body.estado;

        empleado.save((err, empleadoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar empleados',
                    errors: err
                });
            }

            empleadoBD.password = ':)';

            res.status(200).json({
                ok: true,
                empleadoBD
            });
        });
    });
});

// =====================================
// Crear usuario
// =====================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var empleado = new Empleado({
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        estado: body.estado
    });

    empleado.save((err, empleadoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            empleado: empleadoBD
        });

    });
});

// =====================================
// Eliminar usuario
// =====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Empleado.findById(id, (err, empleado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empleados',
                errors: err
            });
        }

        if (!empleado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el id especificado' }
            });
        }

        empleado.estado = 'Baja';

        empleado.save((err, empleadoBD) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                empleado: empleadoBD
            });
        });
    });
});

module.exports = app;