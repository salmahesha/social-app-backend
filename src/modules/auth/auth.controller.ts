import express from 'express';
import authService from './auth.service';
import successResponse from '../../common/response/success.responce';
import { validation } from '../../Middlewares/validatioin.middleware';
import { confirmationSchema, loginSchema, signupSchema } from './auth.validation';
const authRouter = express.Router();

authRouter.post("/signup", validation(signupSchema) , async(req:express.Request , res:express.Response )=>{
    const result =await authService.signup(req.body);
    return successResponse<any>({res , statusCode:201 ,msg:"User Added Successfully" ,data:result});
});
authRouter.post("/login", validation(loginSchema) , async(req:express.Request , res:express.Response )=>{
    const result =await authService.login(req.body);
    return successResponse<any>({res , statusCode:200 ,msg:"User LoggedIn Successfully " ,data:result});
});
authRouter.post("/signup/gmail" , async(req , res)=>{
    const result = await authService.signupWithGmail(req.body)
    return successResponse({res:res , statusCode:result.status , data:result.data , msg:result.msg})
})

authRouter.post("/confirm-email" , validation(confirmationSchema) , async(req , res)=>{
    const result = await authService.confirmEmail(req.body)
    return successResponse({res , statusCode:200 ,msg:"Email confirmed" ,data:result})
})
authRouter.post("/resend-otp" , async(req , res)=>{
    console.log(req.body);
    
    const result = await authService.resendOTP(req.body.email)
    return successResponse({res , statusCode:200 ,msg:"Check Your Box" ,data:result})
})
authRouter.post("/send-mail-forget-password" , async(req , res)=>{
    console.log(req.body);
    
    const result = await authService.sendOTPForgetpassword(req.body.email)
    console.log({result});
    
    return successResponse({res:res , statusCode:201 , data:"Check your box"})
})
authRouter.post("/resend-otp-password" , async(req , res)=>{
    console.log(req.body);
    
    const result = await authService.resendOTPPassword(req.body.email)
    console.log({result});
    
    return successResponse({res:res , statusCode:201 , data:"Check your box"})
})
authRouter.post("/verify-forget-password" , async(req , res)=>{
    console.log(req.body);
    
    const result = await authService.verifyOTPForgetpassword(req.body)
    return successResponse({res:res , statusCode:201 , data:"verified successfully"})
})
authRouter.post("/reset-forget-password" , async(req , res)=>{
    console.log(req.body);
    
    const result = await authService.resetPassword(req.body)
    return successResponse({res:res , statusCode:200 , data:"Done"})
})




export default authRouter