import { HydratedDocument, model, Schema, Types } from "mongoose";
import { PostPrivacyEnum } from "../../Enums/post.enum";

export interface IPost {
    content?:string;
    attachments?:string[];
    likes?:Types.ObjectId[];
    tags?:Types.ObjectId[];
    privacy:PostPrivacyEnum;
    createdBy:Types.ObjectId;
    deleteAt:Date
}
export type IHPost = HydratedDocument<IPost>;
const postSchema = new Schema<IPost>({
    content:{type:String , required:function():boolean{
        return !this.attachments?.length;
    }},
    attachments:[String],
    likes:[{type:Types.ObjectId , ref:"User"}],
    tags:[{type:Types.ObjectId ,ref:"User"}],
    privacy:{type:Number,enum:PostPrivacyEnum , default:PostPrivacyEnum.PUBLIC},
    deleteAt:Date,
    createdBy:{type:Types.ObjectId , ref:"User" , required:true}


    
}, {timestamps:true});

postSchema.pre(['findOne' , 'find' , "countDocuments"]  , function(){
    console.log(this.getQuery());
    const query =this.getQuery();
    if(!query.getSoftDelete){
        this.setQuery({...query , deleteAt:{$exists:false}});
    }
    
});
const postModel = model<IPost>("Post" , postSchema);
export default postModel;