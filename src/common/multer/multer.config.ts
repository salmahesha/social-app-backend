import multer from "multer";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { MulterEnum } from "../Enums/multer.enum";
import { allowedFileFormats, fileFilter } from "./multer.validation";
import cloudinary from "../../config/cloudinary";

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

    return multer({storage , fileFilter: (req, file, callback) => {

            if (!allowedFormate.includes(file.mimetype)) {
                return callback(
                    new Error("Invalid file format")
                );
            }

            callback(null, true);
        }
    });
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};