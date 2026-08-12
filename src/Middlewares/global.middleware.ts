import type {Request , Response , NextFunction} from "express"
import customErr from "../common/Exceptions/custom.error";
interface IError extends customErr{
    statusCode:number
} 


function globalHandling (
    err:IError,
    req:Request,
    res:Response,
    next:NextFunction
){
    console.log("ERROR TYPE:", err.constructor.name);
console.log("ERROR:", err);
console.log("STATUS:", err.statusCode);
    res.status(err.statusCode).json({errorMsg:err.message , stack:err.stack , err ,cause:err.cause});
}

export default globalHandling