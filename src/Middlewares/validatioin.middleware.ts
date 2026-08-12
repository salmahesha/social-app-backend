
import type {Request , Response , NextFunction} from "express"

import { badRequestException } from "../common/Exceptions/domain.exceptions"
import {z , type ZodType} from "zod"
import { GenderEnum } from "../common/Enums/user.enum";

type KeyReqType = keyof Request;
export function validation(schema: Partial<Record<keyof Request , ZodType>>){
    
    return (req:Request , res:Response , next:NextFunction )=>{
        const validationsErr:{path:PropertyKey[] , message:string}[] = [];
        for(const key of Object.keys(schema) as KeyReqType[]){

            const validationResult = schema[key]!.safeParse(req[key])
            if(!validationResult.success){
                validationsErr.push(
                    ...validationResult.error.issues.map((ele)=>{
                    return {path:ele.path ,message:ele.message}
                }))
            }
        }
        if(validationsErr.length > 0){
                            throw new badRequestException("invalid validation" , {validationsErr})

        }
        next()
    }
}
export const commonValidation = {
            userName:z.string().min(2).max(15).regex(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)),
            password:z.string().min(8).max(16).regex(new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}/)),
            email:z.email(),
            confirmPassword:z.string().min(8).max(16).regex(new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}/)),
            age:z.number().positive(),
            phone :z.string().regex(new RegExp(/^(\+201|00201|01)[0-25]\d{8}$/)),
            gender:z.number(),
            otp: z.number().min(100000).max(999999)

    
}
// regex(new RegExp(/^[A-za-z0-9]{3,25}@(gmail|yahoo|outlook|icloud)(.com|.net|.co|.eg){1,4}$/))