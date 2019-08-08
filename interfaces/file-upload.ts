


export interface FileUpload {



    name :string;
    data :any;
    encoding:string;
    temFilePath :string;
    truncated:boolean;
    mimetype :string;

    mv:Function;
}