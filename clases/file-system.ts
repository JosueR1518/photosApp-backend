import { FileUpload } from '../interfaces/file-upload';
import * as path from "path";


import * as fs from "fs";

import * as uniqid from "uniqid";


export default class FileSystem{

constructor(){


    
}


guardarImagenTemporal(file:FileUpload,userId:string){



    return new Promise((resolve,reject)=>{
            //crear carpetas
            const path = this.getOrCreateFolderUser(userId);


            //nombre del archivo


            const nombreArchivo = this.generarNombreUnico(file.name);

            //mover archivo a temp

            file.mv(`${path}/${nombreArchivo}`,(err:any)=>{

                    if(err){
                            reject();
                    }else{
                            resolve();
                    }
            });


    });
   
        
}

public getFotoUrl(userId:string,img:string){
        const pathUserPost= path.resolve(__dirname,'../uploads',userId,'posts',img);


        if(!fs.existsSync(pathUserPost)){

                return path.resolve(__dirname,'../assets/400x250.jpg');
        }


        return pathUserPost;




}


public moverImagenesTempHaciaPost(userId:string){

        const pathUserTemp= path.resolve(__dirname,'../uploads',userId,'temp');
        const pathUserPost= path.resolve(__dirname,'../uploads',userId,'posts');


        if(!fs.existsSync(pathUserTemp)){
                return [];
        }


        if(!fs.existsSync(pathUserPost)){
                fs.mkdirSync(pathUserPost);

        }



        const imagenesTemp = this.obtenerImagenesTemp(userId);



        imagenesTemp.forEach(image=>{

                fs.renameSync(`${pathUserTemp}/${image}`,`${pathUserPost}/${image}`);     
        });


        return imagenesTemp;
}


private generarNombreUnico(nombreOriginal:string){
    
    const nombreArr = nombreOriginal.split('.');
    const extension = nombreArr[nombreArr.length -1 ];

    const idUnico = uniqid();

    return `${idUnico}.${extension}`;

}


 private getOrCreateFolderUser(userId:string){


    const pathUser= path.resolve(__dirname,'../uploads',userId);

    const pathUserTemp= pathUser +'/temp';


    console.log(pathUser);

    const existe = fs.existsSync(pathUser);

    if(!existe){
        fs.mkdirSync(pathUser);
        fs.mkdirSync(pathUserTemp);

    }


    return pathUserTemp;



 }


 private obtenerImagenesTemp(userId:string){

        const pathUserTemp= path.resolve(__dirname,'../uploads',userId,'temp');


        return fs.readdirSync(pathUserTemp) || [];



 }
}