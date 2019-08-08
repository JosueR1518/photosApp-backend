import Server from './clases/server';
import * as mongoose from 'mongoose';
import userRoutes from './routes/usuario';
import * as bodyparser from 'body-parser';
import postRoutes from './routes/post';
import * as cors from "cors";

import * as fileupload from "express-fileupload";


const server = new Server();

//Body parser
server.app.use(bodyparser.urlencoded({extended:true}));
server.app.use(bodyparser.json());
 
//FileUpload, toma archivos y los ubica en una sección especial "files" (req.files)

server.app.use(fileupload());


/**
 * Configuraciòn de CORS
 */
 server.app.use(cors({origin:true,credentials:true}));




 //Rutas de mi app
server.app.use('/user',userRoutes);
server.app.use('/posts',postRoutes);


//Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',
{useNewUrlParser:true,useCreateIndex:true},(err)=>{

    if(err) throw err;

    console.log('Base de datos Online');
});



//inicio del Express Server
server.start(()=>{

    console.log(`Servidor corriendo en puerto  ${server.port}`);
});