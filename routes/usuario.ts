import { Router,Response} from "express";
import { Usuario } from '../models/usuario.model';
import  * as bcrypt from "bcrypt";
import Token from '../clases/token';
import { verificaToken } from '../middleware/autenticacion';



const userRoutes = Router();

//Login

userRoutes.post('/login',(req,resp)=>{


    const data = req.body;


    Usuario.findOne({email:data.email},(err,userDB)=>{

        if(err)throw err;

        if(!userDB){
                return resp.json({
                    ok:false,
                    mensaje:'Usuario/contraseña no son correctos'
                });
        }


        if(userDB.compararPassword(data.password)){


            const userToken = Token.getJwtToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email,
                avatar:userDB.avatar
            });
            return resp.json({
                ok:true,
                token: userToken
            });
        }else{
            return resp.json({
                ok:false,
                mensaje:'Usuario/contraseña no son correctos *****'
            });

        }
    });
    
   
});


//Crear usuario
userRoutes.post('/create',(req,resp)=>{


    const data = req.body;
    const user = {
        nombre:data.nombre,
        email:data.email,
        password: bcrypt.hashSync(data.password,10),
        avatar:data.avatar
    };


    Usuario.create(user).then(userDB=>{

        const userToken = Token.getJwtToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });
        resp.json({
            ok:true,
            token:userToken});

    }).catch(err=>{
        resp.json({
            ok:false,
            err});
    });
   
});



//actualizar usuario
userRoutes.post('/update',verificaToken,(req:any,resp:Response)=>{


    const data = req.body;
    const user = {
        nombre:data.nombre || req.usuario.nombre,
        email:data.email || req.usuario.email,
        avatar:data.avatar || req.usuario.avatar
    };


    Usuario.findByIdAndUpdate(req.usuario._id,user,{new:true},(err,userDB)=>{

        if(err)throw err;

        if(!userDB){
            resp.json({
                ok:true,
                mensaje:'No existe un usuario con ese ID'});
        }

        const userToken = Token.getJwtToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });

        resp.json({
            ok:true,
            token:userToken});

    });
    
    
   
});


userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario
    });

});



export default userRoutes;