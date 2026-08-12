import * as z from "zod"
import { commonValidation } from "../Middlewares/validatioin.middleware"
export const loginSchema = {
    body: z.object({
        email:commonValidation.email,
        password:commonValidation.password,
    })
}
export const signupSchema = {
        
    body: loginSchema.body.extend({
        userName:commonValidation.userName,
        confirmPassword:commonValidation.confirmPassword,
        age:commonValidation.age.optional(),
        phone :commonValidation.phone.optional(),
        gender :commonValidation.gender.optional(),
        confirmEmail :z.number().optional(),
        role :z.number().optional(),

    }).refine(data=>data.confirmPassword == data.password ,{ error:"Confirm Password Doesn't Match Password"})
}

export const confirmationSchema = {
    body:z.strictObject({
        emailOTP:commonValidation.otp,
        email:commonValidation.email,
    })
}
export const resetPassSchema = {
    body:z.strictObject({
        otp:commonValidation.otp,
        email:commonValidation.email,
        password:commonValidation.password
    })
}

