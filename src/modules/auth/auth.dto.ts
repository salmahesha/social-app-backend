import z from "zod"
import { confirmationSchema, loginSchema, resetPassSchema, signupSchema } from "./auth.validation"

export interface signupDto{
    userName:string,
    email:string,
    password:string,
    confirmPassword:string
}
export interface loginDto extends signupDto{
    FCM: any;
    
}

export type SignupDto = z.infer<typeof signupSchema.body>
export type LoginDto = z.infer<typeof loginSchema.body>
export type ConfirmDto = z.infer<typeof confirmationSchema.body>
export type resetPassDto = z.infer<typeof resetPassSchema.body>
