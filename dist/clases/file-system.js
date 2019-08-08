"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
class FileSystem {
    constructor() {
    }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.getOrCreateFolderUser(userId);
            //nombre del archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            //mover archivo a temp
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }
    getFotoUrl(userId, img) {
        const pathUserPost = path.resolve(__dirname, '../uploads', userId, 'posts', img);
        if (!fs.existsSync(pathUserPost)) {
            return path.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathUserPost;
    }
    moverImagenesTempHaciaPost(userId) {
        const pathUserTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        const pathUserPost = path.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs.existsSync(pathUserTemp)) {
            return [];
        }
        if (!fs.existsSync(pathUserPost)) {
            fs.mkdirSync(pathUserPost);
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(image => {
            fs.renameSync(`${pathUserTemp}/${image}`, `${pathUserPost}/${image}`);
        });
        return imagenesTemp;
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`;
    }
    getOrCreateFolderUser(userId) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);
        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    obtenerImagenesTemp(userId) {
        const pathUserTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(pathUserTemp) || [];
    }
}
exports.default = FileSystem;
