"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middleware/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = require("../clases/file-system");
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//Crear post
postRoutes.post('/', autenticacion_1.verificaToken, (req, resp) => {
    const imagenes = fileSystem.moverImagenesTempHaciaPost(req.usuario._id);
    const data = req.body;
    data.imgs = imagenes;
    data.usuario = req.usuario._id;
    post_model_1.Post.create(data).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password').execPopulate();
        resp.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        resp.json(err);
    });
});
//Obtener posts paginados
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = (Number(req.query.pagina)) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-passwaord')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//Subir archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos que subir'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos que subir -image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que se subió no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    return res.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/image/:userid/:imgname', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.imgname;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.json({
        ok: true,
        pathFoto
    });
});
exports.default = postRoutes;
