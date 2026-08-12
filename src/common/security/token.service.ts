import { randomUUID } from "crypto";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { RoleEnum } from "../Enums/user.enum";
import { TOKEN_SIGNATURE_ADMIN, TOKEN_SIGNATURE_REFRESH_ADMIN, TOKEN_SIGNATURE_REFRESH_USER, TOKEN_SIGNATURE_USER } from "../../config/config.service";
import { signupDto } from "../../auth/auth.dto";
import { IHUser } from "../DB/models/user.model";
import { TokenEnum } from "../Enums/token.enum";


 
    class TokenService{
    
    public getSignature(role:RoleEnum = RoleEnum.User){
        let access_signature = "";
        let Refresh_signature = "";
    
        switch (role) {
            case RoleEnum.Admin:
                access_signature = TOKEN_SIGNATURE_ADMIN;
                Refresh_signature = TOKEN_SIGNATURE_REFRESH_ADMIN;
                break;
            case RoleEnum.User:
                access_signature = TOKEN_SIGNATURE_USER;
                Refresh_signature = TOKEN_SIGNATURE_REFRESH_USER;
                break;
        }
        return {access_signature , Refresh_signature}
    }

    public generateToken({payload= {} , signature ,options }:{payload?:string|object , signature:string , options?:SignOptions}){
    return jwt.sign(payload ,signature,options)
    
    }
    public verifyToken({token , signature }:{token:string , signature:string }){
    return jwt.verify(token ,signature);
    
    }

    public decodeToken(token:string){
        return jwt.decode(token);
    }

    public getTokens(user:IHUser){
        const {access_signature , Refresh_signature} =this.getSignature(user.role);
        const tokenId = randomUUID();
        const access_token = this.generateToken({signature:access_signature , options:{
            audience:[String(user.role) , TokenEnum.Access],
            subject:user._id.toString(),
            expiresIn:60*60*15,
            jwtid:tokenId

        }})
        const refresh_token = this.generateToken({signature:Refresh_signature , options:{
            subject:user._id.toString(),
            expiresIn:"1y",
            audience:[String(user.role) , TokenEnum.Refresh],
            jwtid:tokenId
        }})
        return {access_token , refresh_token}

    }
    }

export default new TokenService