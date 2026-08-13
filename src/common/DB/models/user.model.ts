import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";
import { number } from "zod";
import { GenderEnum, ProviderEnum, RoleEnum } from '../../Enums/user.enum';
import { encrypt } from "../../security/encryption";
import { hashValue } from "../../security/hash";
import { ENCRYPTION_KEY } from "../../../config/config.service";
import MailService from '../../Email/email.service';
import { EmailEnum } from "../../Enums/email.enum";
const mailService = new MailService(); 
export interface IUser {
    userName:string;
    email:string;
    phone:string;
    gender:GenderEnum;
    password:string;
    confirmEmail:boolean;
    coverPic:[string];
    picture:[string];
    friends?:Types.ObjectId;
    age:number;
    role:RoleEnum;
    provider:ProviderEnum;
    changeCreditTime:Date
}

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  gender: {
    type: Number,
    enum: GenderEnum,
    default: GenderEnum.Male,
  },
  friends:[{type:Types.ObjectId , ref:"User"}],
  provider:{type:Number ,enum:ProviderEnum, default:ProviderEnum.System},
  password: {
    type: String,
    required: function ():boolean {
      return this.provider === ProviderEnum.System;
    },
  },

  confirmEmail: {
    type: Boolean,
  },

  coverPic: [String],
   picture: [String],

  age: {
    type: Number,
  },

  role: {
    type: Number,
    enum: RoleEnum,
    default: RoleEnum.User,
  },

  changeCreditTime: {
    type: Date,
  },

},
  {
    timestamps:true
  }
);

userSchema.pre('save' , async function(this: IHUser & {wasNew:boolean}){
  this.wasNew = this.isNew;
  if(this.isModified('password')){

    const hashedpassword = await hashValue({
              plainText: this.password
          });
  
          this.password = hashedpassword;
  }
  if(this.phone && this.isModified('phone')){

    this.phone = encrypt({
        text: this.phone,
        key: ENCRYPTION_KEY
    });
  }
})
userSchema.post("save" ,async function(this: IHUser & {wasNew:boolean}){
  try {
    if(this.wasNew){
       await mailService.sendEmailOTP({
                  email:this.email,
                  type: EmailEnum.ConfirmEmail,
                  subject: EmailEnum.ConfirmEmail
              });
      
    }
  } catch (error) {
    console.log(error);
  }
} )
export type IHUser = HydratedDocument<IUser>;
export const userModel = model<IUser>("User" , userSchema);