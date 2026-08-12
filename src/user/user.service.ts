import { ObjectId } from "mongoose";
import UserRepo from "../common/DB/Repo/user.repo";
import { IHUser, IUser } from "../common/DB/models/user.model";
import { decrypt, encrypt } from "../common/security/encryption";
import { ENCRYPTION_KEY } from '../config/config.service';
import { badRequestException } from "../common/Exceptions/domain.exceptions";
import { JwtPayload } from "jsonwebtoken";
import redisService from "../common/redis/redis.service";

class userService{
    private _userRepo = new UserRepo()
    public async getUserById(id:string|ObjectId){
        const user = await this._userRepo.findById({id:id});
        if(!user){throw new badRequestException("user not found")}
        // user.phone  =  decrypt({cipheredText:user.phone  , key:ENCRYPTION_KEY})

        console.log(user.phone);
const decrypted = decrypt({
    cipheredText: user.phone as string,
    key: ENCRYPTION_KEY as string
});
console.log({ENCRYPTION_KEY ,user:user.phone});


console.log("Decrypted:", decrypted);
        return user
    }

 async  logout(userId:string | ObjectId, tokenData:JwtPayload  , logoutOptions:string) {
     console.log("userId:", userId);
    console.log("tokenData:", tokenData);
    console.log("logoutOptions:", logoutOptions);
    if(logoutOptions == "all"){
        await this._userRepo.updateOne({
            filter:{_id:userId},
            data:{changeCreditTime: new Date()}
        });
    }else{
        await redisService.set({
            key:redisService.blackListTokenKey({userId:userId as string , tokenId:tokenData.jti as string}),
            value:tokenData.jti as string,
            exVal:(60 * 60 * 365 * 24) - (Date.now() / 1000 - tokenData.iat!)
        })

    }
}
}
export default new userService