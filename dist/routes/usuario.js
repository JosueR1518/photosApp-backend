"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt = require("bcrypt");
const token_1 = require("../clases/token");
const autenticacion_1 = require("../middleware/autenticacion");
const userRoutes = express_1.Router();
//Login
userRoutes.post('/login', (req, resp) => {
    const data = req.body;
    usuario_model_1.Usuario.findOne({ email: data.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(data.password)) {
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            return resp.json({
                ok: true,
                token: userToken
            });
        }
        else {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos *****'
            });
        }
    });
});
//Crear usuario
userRoutes.post('/create', (req, resp) => {
    const data = req.body;
    const user = {
        nombre: data.nombre,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        avatar: data.avatar
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        resp.json({
            ok: true,
            token: userToken
        });
    }).catch(err => {
        resp.json({
            ok: false,
            err
        });
    });
});
//actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, resp) => {
    const data = req.body;
    const user = {
        nombre: data.nombre || req.usuario.nombre,
        email: data.email || req.usuario.email,
        avatar: data.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            resp.json({
                ok: true,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        resp.json({
            ok: true,
            token: userToken
        });
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
