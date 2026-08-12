import { ObjectId } from "mongoose";
import { IUser, userModel } from "../models/user.model";
import DBRepo from "./db.repo";

class UserRepo extends DBRepo<IUser>{
    constructor(){
        super(userModel)
    }
    public async checkExistUser(id:ObjectId){ 
        return (await this.findOne({filter:{_id:id}})) != null;
    }
}
export default UserRepo