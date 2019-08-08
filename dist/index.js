"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./clases/server");
const mongoose = require("mongoose");
const usuario_1 = require("./routes/usuario");
const bodyparser = require("body-parser");
const post_1 = require("./routes/post");
const cors = require("cors");
const fileupload = require("express-fileupload");
const server = new server_1.default();
//Body parser
server.app.use(bodyparser.urlencoded({ extended: true }));
server.app.use(bodyparser.json());
//FileUpload, toma archivos y los ubica en una sección especial "files" (req.files)
server.app.use(fileupload());
/**
 * Configuraciòn de CORS
 */
server.app.use(cors({ origin: true, credentials: true }));
//Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos Online');
});
//inicio del Express Server
server.start(() => {
    console.log(`Servidor corriendo en puerto  ${server.port}`);
});
