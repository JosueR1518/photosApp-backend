import { Router,Response} from "express";
import { verificaToken } from '../middleware/autenticacion';
import { Post } from '../models/post.model';
import { json } from "body-parser";
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';



const postRoutes = Router();
const fileSystem = new FileSystem();
        



//Crear post
postRoutes.post('/',verificaToken,(req:any,resp:Response)=>{


    
    const imagenes = fileSystem.moverImagenesTempHaciaPost(req.usuario._id);

    const data = req.body;


    data.imgs = imagenes;
    data.usuario = req.usuario._id
    Post.create(data).then(async postDB=>{


      await  postDB.populate('usuario','-password').execPopulate();
        resp.json({
            ok:true,
            post:postDB});


    }).catch(err=>{
        resp.json(err);
    }); 
   
});

//Obtener posts paginados
postRoutes.get('/',async (req,res:Response)=>{


    let pagina = (Number (req.query.pagina)) || 1;
    let skip = pagina - 1
    skip = skip * 10;

    const posts = await Post.find()
                                .sort({_id:-1})
                                .skip(skip)
                                .limit(10)
                                .populate('usuario','-passwaord')
                                .exec();

    res.json({
        ok:true,
        pagina,
        posts
    })


});

//Subir archivos
postRoutes.post('/upload',[verificaToken],async (req,res:Response)=>{



        if(!req.files){
            return res.status(400).json({
                ok:false,
                mensaje:'No hay archivos que subir'
            });
        }


        const file:FileUpload = req.files.image;

        if(!file){
            return res.status(400).json({
                ok:false,
                mensaje:'No hay archivos que subir -image'
            });
        }

        if(!file.mimetype.includes('image')){
            return res.status(400).json({
                ok:false,
                mensaje:'Lo que se subió no es una imagen'
            });

        }


        await fileSystem.guardarImagenTemporal(file,req.usuario._id);
   



        return res.json({
            ok:true,
            file:file.mimetype
        });
});



postRoutes.get('/image/:userid/:imgname',(req,res)=>{

    const userId = req.params.userid;
    const img = req.params.imgname;

    const pathFoto = fileSystem.getFotoUrl(userId,img);

 
    res.sendFile(pathFoto);
});

export default postRoutes;