import express from "express";
import { authentication } from "../Middlewares/authentication.middleware";
import userService from "./user.service";
import successResponse from "../common/response/success.responce";
import { validation } from "../Middlewares/validatioin.middleware";
import { logoutSchema } from "./user.validation";
import { cloudFileUpload } from "../common/multer/multer.config";

const userRouter = express.Router();

userRouter.get("", authentication() , async (req:express.Request , res:express.Response )=>{
    const result = await userService.getUserById(req.payload.sub!);
    return successResponse({res , msg:"User Details" , data:result})
});
userRouter.post("/logout", authentication() , validation(logoutSchema) , async (req:express.Request , res:express.Response )=>{
    const result = await userService.logout(req.payload.sub! , req.payload , req.body.logoutOptions);
    return successResponse({res , msg:"User logged out" , data:result})
});
userRouter.post("/upload-profile-picture", authentication() ,cloudFileUpload().single('profilePic') , async (req:express.Request , res:express.Response )=>{
    return successResponse({res , msg:"User Picture" , data:req.file})
});

export default userRouter