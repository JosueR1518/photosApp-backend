"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../clases/token");
exports.verificaToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.comprobarToken(userToken).then((decoded) => {
        req.usuario = decoded.usuario;
        next();
    }).catch((err) => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    });
};
