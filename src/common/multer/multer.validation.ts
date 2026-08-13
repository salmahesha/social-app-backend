import { Request } from "express";
import { FileFilterCallback } from "multer";
import { badRequestException } from "../Exceptions/domain.exceptions";

export const allowedFileFormats = {
    img:["image/png" , "image/jpg" , "image/jpeg"],
    video:["video/mp4"],
    pdf:["application/pdf"]
}
export function fileFilter(allowedFormate: string[]) {
    return (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {

        if (!allowedFormate.includes(file.mimetype)) {
            return cb(
                new badRequestException("Invalid file format", {
                    cause: { statusCode: 400 }
                })
            );
        }

        return cb(null, true);
    };
}