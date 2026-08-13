import express from "express";
import { cloudFileUpload } from "../../common/multer/multer.config";
import { validation } from "../../Middlewares/validatioin.middleware";
import { createPostSchema, findPostSchema } from "./post.validation";
import successResponse from "../../common/response/success.responce";
import postService from "./post.service";
import { authentication } from "../../Middlewares/authentication.middleware";
import { IHUser } from "../../common/DB/models/user.model";

const postRouter = express.Router();

postRouter.post("/create-post", authentication() , cloudFileUpload({}).array("attachments" , 5),validation(createPostSchema) , async(req:express.Request , res:express.Response )=>{
    console.log("create");
    const result =await postService.createPost(req.body , req.payload.sub! , req.files as Express.Multer.File[]);
    return successResponse({res , statusCode:201 , data:result} )
    
})
postRouter.patch("/update-post/:postId", authentication() , cloudFileUpload({}).array("attachments" , 5),validation(createPostSchema) , async(req:express.Request , res:express.Response )=>{
    console.log("create");
    const result =await postService.updatePost( req.payload.sub!, req.params.postId as string ,req.body, req.files as Express.Multer.File[]);
    return successResponse({res , statusCode:201 , data:result} )
    
})
postRouter.get("/find-post", authentication() , validation(findPostSchema), async(req:express.Request , res:express.Response )=>{
    // console.log("create");
    const result =await postService.findPost(req.user as IHUser , req.query );
    return successResponse({res , statusCode:200 , data:result} )
    
})
export default postRouter;