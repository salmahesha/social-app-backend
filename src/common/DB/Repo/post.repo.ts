import { ObjectId } from "mongoose";
import DBRepo from "./db.repo";
import postModel, { IPost } from "../models/post.model";

class PostRepo extends DBRepo<IPost>{
    constructor(){
        super(postModel)
    }
    
}
export default PostRepo