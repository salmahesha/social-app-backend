import { compare, hash } from "bcrypt";
import { SALT_ROUND } from "../../config/config.service";


export async function hashValue({plainText , Rounds = SALT_ROUND}:{plainText:string , Rounds?:number})
{
    return await hash(plainText , Rounds)
} 
export async function compareOperation({val , encryptedVal}:{val:string , encryptedVal:string})
{
    return await compare(val , encryptedVal);
} 
