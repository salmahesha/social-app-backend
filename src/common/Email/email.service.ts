import { EmailEnum } from "../Enums/email.enum";
import { badRequestException } from "../Exceptions/domain.exceptions";
import { generateOTP } from "../OTP/otp";
import redisService from "../redis/redis.service";
import { hashValue } from "../security/hash";
import { sendMail } from "./email.config";

class MailService{
constructor(){}

    async  sendEmailOTP({ email, type = EmailEnum.ConfirmEmail, subject }:{ email:string, type?:EmailEnum, subject:string }) {
        console.log("SEND OTP START", {
            email,
            type,
            subject
        });
        const otpTTL = await redisService.ttl(
            redisService.OTP({
                email,
                confirmation: type
            })
        );

        if (otpTTL > 0) {
            throw new badRequestException(
                `There is already OTP valid for ${otpTTL} seconds`
            );
        }

        const isBlocked = await redisService.exists(
            redisService.OTP({
                email,
                confirmation: type,
                track: "Blocked"
            })
        );

        if (isBlocked) {
            throw new badRequestException("Try again later");
        }

        const counterKey = redisService.OTP({
            email,
            confirmation: type,
            track: "No"
        });

        const reqNo = await redisService.get(counterKey);

        if (Number(reqNo) >= 5) {

            await redisService.set({
                key: redisService.OTP({
                    email,
                    confirmation: type,
                    track: "Blocked"
                }),
                value: 1,
                exVal: 60 * 10
            });

            throw new badRequestException(
                "You can't request more than 5 emails in 20 minutes"
            );
        }

        const otp = generateOTP();

        await sendMail({
            to: email,
            subject,
            text: String(otp),
            html:`<h1> OTP is: ${otp}</h1>`
        });

        await redisService.set({
            key: redisService.OTP({
                email,
                confirmation: type
            }),
            value:String( await hashValue({
                plainText: String(otp)
            })),
            exVal: 120
        });

        if (reqNo) {
            await redisService.incr(counterKey);
        } else {
            await redisService.set({
                key: counterKey,
                value: 1,
                exVal: 60 * 20
            });
        }
    }

}
export default MailService;