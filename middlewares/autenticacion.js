var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// =====================================
// Verificar Token
// =====================================
exports.verificaToken = function(req, res, netx) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }
    });

    req.usuario = decoded.usuario;

    next();
}