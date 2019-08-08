
import {Schema,model,Document} from 'mongoose';
import * as bcrypt from 'bcrypt';

const usuarioSchema = new Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    avatar:{
        type:String,
        default:'av-1.png'
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es requerido']
    },

    password:{
        type:String,
        required:[true,'La ocntraseña es requerida']
    }
});



usuarioSchema.method('compararPassword',function(pass:string=''){

    if(bcrypt.compareSync(pass,this.password)){
        return true;
    }
    else{
        return false;
    }
});

interface IUsuario extends Document{
nombre:string,
email:string,
avatar:string,
password:string


compararPassword(pass:string):boolean;
}

export const Usuario=  model<IUsuario>('Usuario',usuarioSchema);