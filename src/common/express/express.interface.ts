import { IHUser, IUser } from "../DB/models/user.model";
import type { JwtPayload} from 'jsonwebtoken';

declare module "express-serve-static-core"{
    interface Request {
        user:IUser | IHUser,
        payload:JwtPayload
    }
}