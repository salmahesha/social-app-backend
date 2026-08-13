import express from "express";
import globalHandling from "./Middlewares/global.middleware";
import authRouter from "./modules/auth/auth.controller";
import { PORT } from "./config/config.service";
import { testDBConnection } from "./common/DB/connection";
import { testRedisConnection } from "./common/redis/redis.connection";
import userRouter from "./user/user.controller";
import cors from "cors"
import postRouter from "./modules/post/post.controller";
async function bootstrap(){
    const app:express.Express = express();
    app.use(express.json());
    app.use(cors())
    await testDBConnection();
    await testRedisConnection();
    app.use('/auth' , authRouter);
    app.use('/user' , userRouter);
    app.use('/post' , postRouter);
    app.post("/send-notification" , async (req,res,next)=>{
        console.log({body:req.body});
        
        return res.json({body:req.body})
    })
    app.use(globalHandling);
    app.use("/*dummy" , (req:express.Request , res:express.Response , next:express.NextFunction):void=>{
        res.status(404).json({"msg":"Invalid URL"});
    });
    app.listen(PORT ,()=>{
        console.log(`Server running on ${PORT}`);
    } );
    
}


export default bootstrap;