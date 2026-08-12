import { TokenEnum } from "../common/Enums/token.enum";
import express from 'express';
import { badRequestException, unauthorizedException } from "../common/Exceptions/domain.exceptions";
import TokenService from "../common/security/token.service";
import redisService from "../common/redis/redis.service";
import { JwtPayload } from "jsonwebtoken";
import UserRepo from "../common/DB/Repo/user.repo";
import { RoleEnum } from "../common/Enums/user.enum";
const _tokenService = TokenService;
const _userRepo = new UserRepo()
export function authentication(token_type:string = TokenEnum.Access) {
    return async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const { authorization } = req.headers;
        const [BearerKey, token] = authorization!.split(" ");

        if (BearerKey != "Bearer") {
            throw new badRequestException("invalid Bearer key");
        }
        const tokenDecoded = _tokenService.decodeToken(token) as JwtPayload
        if(!tokenDecoded || !tokenDecoded.aud){
            throw new unauthorizedException("Invalid token type")
        }
        const [userRole, tokenType] = tokenDecoded.aud as [RoleEnum, TokenEnum];
        console.log("Decoded:", tokenDecoded);
        console.log("BearerKey:", BearerKey);
        console.log("Token:", token);
        console.log({ authorization });

        const { access_signature, Refresh_signature } = _tokenService.getSignature(Number(userRole) as RoleEnum);

        console.log(req.headers);
        console.log(req.headers.authorization);
        console.log(authorization);
        if (tokenType !== token_type) { throw new badRequestException("invalid token type") }
        const verifiedToken =_tokenService.verifyToken({
            token: token,
            signature: tokenType == TokenEnum.Access ? access_signature : Refresh_signature
        })as JwtPayload
      if (!verifiedToken.jti) {
    throw new unauthorizedException("Invalid token");
}

if (
    await redisService.get(
        redisService.blackListTokenKey({
            userId: verifiedToken.sub!,
            tokenId: verifiedToken.jti
        })
    )
) {
    throw new unauthorizedException("You need to login again");
}
        console.log(tokenDecoded);

        const user = await _userRepo.findById({id:tokenDecoded.sub});
        if (!user) {
           throw new unauthorizedException("User not found , first Sign up!")
        }
        console.log("verified token :", verifiedToken);
        if(new Date(verifiedToken.iat! * 1000) < user.changeCreditTime){
           throw new unauthorizedException("You need to login again")
        }
        req.user = user;
        req.payload = verifiedToken;
        next();
    }
}