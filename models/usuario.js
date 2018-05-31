var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

var estadosValidos = {
    values: ['Activo', 'Baja', 'Suspendido'],
    message: '{VALUE} no es un estado valido'
};

var empleadoSchema = new Schema({
    nombres: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellidos: { type: String, required: [true, 'El apellido es obligatorio'] },
    email: { type: String, required: [true, 'El correo es obligatorio'], unique: true },
    password: { type: String, required: [true, 'El password es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: String, required: true, default: 'Activo', enum: estadosValidos }
});

empleadoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Empleado', empleadoSchema);