import { IHUser, userModel } from "../../common/DB/models/user.model";
import UserRepo from "../../common/DB/Repo/user.repo";
import { badRequestException, conflictException, NotFoundException } from "../../common/Exceptions/domain.exceptions";
import { encrypt, decrypt } from "../../common/security/encryption";
import { compareOperation, hashValue } from "../../common/security/hash";
import { ENCRYPTION_KEY, GOOGLE_CLIENT_ID } from '../../config/config.service';
import { ConfirmDto, loginDto, resetPassDto, signupDto } from "./auth.dto";
import TokenService from "../../common/security/token.service";
import redisService from "../../common/redis/redis.service";
import { EmailEnum } from "../../common/Enums/email.enum";
import MailService from "../../common/Email/email.service";
import { ObjectId } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../common/Enums/user.enum";
import notificationService from "../../common/notifecation/notification.service";

class AuthService {
    private userRepo = new UserRepo();
    private tokenService = TokenService;
    private _mailService = new MailService();
    private _NotificationService = notificationService;


    public async signup(body: IHUser): Promise<IHUser> {
        const { email } = body;
        const isEmail = await this.userRepo.findOne({ filter: { email } });
        if (isEmail) {
            throw new conflictException("Email Already Exist");
        }

        const [user] = await this.userRepo.create({ data: [body] });

        return user;


    }
    async login(body: loginDto) {

        const { email, password } = body;
        const user = await this.userRepo.findOne({ filter: { email: email } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (!user.confirmEmail) { throw new badRequestException("Your email need to confirmation"); }
        const validPass = await compareOperation({ encryptedVal: user.password, val: password })
        if (!validPass) {
            throw new badRequestException("password wrong")
        }
        // user.phone =  decrypt({ cipheredText: user.phone, key: ENCRYPTION_KEY })

        if(body.FCM){
            await redisService.addToSet(user._id , body.FCM);
            const tokens = await redisService.getSetMembers(user._id);
            await this._NotificationService.sendNotifications({tokens ,data:{title:"user logged in" , body:`user logged in at ${new Date()}`}})
        }
        const tokens = this.tokenService.getTokens(user)
        return tokens

    }
async  verifyToken(tokenId:string | ObjectId)
{
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: tokenId as string,
        audience:GOOGLE_CLIENT_ID,  
    });
    const payload = ticket.getPayload();
        return payload;

}

     async  signupWithGmail(bodyData:any ){
    const {idToken} = bodyData;
    const payloadGoogleToken = await this.verifyToken(idToken)
    if(!payloadGoogleToken){throw new badRequestException("Email not verified");}
    const user = await this.userRepo.findOne({filter:{email:payloadGoogleToken.email as string}});
    if(user){

        if(user.provider==ProviderEnum.System)
            {
                throw new badRequestException("User already Exist you login with your email and password");
            }
        return{status:200 , data:await this.loginWithGoogle(idToken) , msg:"User logged in successfully"}
    }
    const newUser = await this.userRepo.create({data:{
        email:payloadGoogleToken.email,
        userName:payloadGoogleToken.name,
        picture:payloadGoogleToken.picture,
        provider:ProviderEnum.Google,
        confirmEmail:true
    }})
  console.log({payloadGoogleToken});
    return {status:201 , data:newUser , msg:"User Added Successfully "}
}
 async  loginWithGoogle(idToken:string){
    const payload = await this.verifyToken(idToken);
    if(!payload){throw new badRequestException("Invalid token payload");}
    if(payload.email_verified!==true){throw new badRequestException("Email not verified");}
    const user = await this.userRepo.findOne({filter:{email:payload.email , provider:ProviderEnum.Google}});
    // if(!user){
    //     return {data: await this.signupWithGmail(payload)}

    // }
    const tokens =this.tokenService.getTokens(user as IHUser)
    return tokens
}


    async confirmEmail(bodyData: ConfirmDto) {
        const { emailOTP, email } = bodyData;

        const user = await this.userRepo.findOne({
            filter: { email }
        });

        if (!user) {
            throw new badRequestException("User not found");
        }

        if (user.confirmEmail) {
            throw new badRequestException("Email is already confirmed");
        }

        const key = redisService.OTP({ email: email, confirmation: EmailEnum.ConfirmEmail });

        const storageOTP = await redisService.get(key);

        if (!storageOTP) {
            throw new badRequestException("OTP expired");
        }

        const isValidOTP = await compareOperation({
            val: String(emailOTP),
            encryptedVal: storageOTP
        });

        if (!isValidOTP) {
            throw new badRequestException("Invalid OTP");
        }

        user.confirmEmail = true;
        await user.save();
    }

    async resendOTP(email: string) {

        await this._mailService.sendEmailOTP({
            email,
            type: EmailEnum.ConfirmEmail,
            subject: EmailEnum.ConfirmEmail
        });

    }
    async resendOTPPassword(email:string) {

        await this._mailService.sendEmailOTP({
            email,
            type: EmailEnum.forgetPassword,
            subject: EmailEnum.forgetPassword
        });

    }
    async sendOTPForgetpassword(email:string) {
        const user = await this.userRepo.findOne({filter: { email } })
        if (!user) { throw new badRequestException("user not found"); }
        if (!user.confirmEmail) {
            throw new badRequestException("confirm your email first");
        }
        return await this._mailService.sendEmailOTP({
            email,
            type: EmailEnum.forgetPassword,
            subject: "Reset Your Password"
        });

    }
    async verifyOTPForgetpassword(bodyData:ConfirmDto) {
        const { email, emailOTP } = bodyData;

        const key = redisService.OTP({
            email,
            confirmation: EmailEnum.forgetPassword
        });

        const emailOtp = await redisService.get(key);

        if (!emailOtp) {
            throw new badRequestException("OTP Expired");
        }

        const isOtpValid = await compareOperation({
            val: String(emailOTP),
            encryptedVal: emailOtp
        });

        if (!isOtpValid) {
            throw new badRequestException("OTP not valid");
        }

        return true;
    }
    async resetPassword(bodyData:resetPassDto) {
        const { email, otp, password } = bodyData;
        await this.verifyOTPForgetpassword({ email, emailOTP: otp });
        await this.userRepo.updateOne({
            filter: { email },
            data: { password: await hashValue({ plainText: password }) }
        })
        const emailOtp = await redisService.get(await redisService.OTP({ email, confirmation: EmailEnum.forgetPassword }))
        if (!emailOtp) {
        throw new badRequestException("OTP Expired");
        }
        const isOtpValid = await compareOperation({
            val: String(otp),
            encryptedVal: emailOtp
        });
        if (!isOtpValid) { throw new badRequestException("otp not valid") }
    }


}

export default new AuthService();