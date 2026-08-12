import multer from "multer";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { MulterEnum } from "../Enums/multer.enum";
import { allowedFileFormats, fileFilter } from "./multer.validation";
console.log(tmpdir());

export function cloudFileUpload({storageApproach = MulterEnum.memory , allowedFormate =allowedFileFormats.img}:{storageApproach?:MulterEnum , allowedFormate?:string[]}={}){
     
    const storage = storageApproach == MulterEnum.memory?multer.memoryStorage(): multer.diskStorage({
        destination(req , file , callback){
            callback(null , tmpdir());
        },
        filename(req , file , callback){
            callback(null , `${randomUUID()}_${file.originalname}`)
        }
     });

    return multer({storage , fileFilter:fileFilter(allowedFormate)})
}