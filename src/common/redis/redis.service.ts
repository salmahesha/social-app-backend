import { ObjectId, Types } from "mongoose";
import { EmailEnum } from "../Enums/email.enum.js";
import { client } from "./redis.connection.js";


class RedisService {
    async set({ key, value, exVal, exType = "EX" }: { key: string, value: string | number, exVal: number, exType?: 'EX' | 'PX' | 'EXAT' | 'PXAT' }) {
        return await client.set(key, value, { expiration: { type: exType, value: Math.floor(exVal) } });
    }
    async get(key: string) {
        return await client.get(key);
    }
    async mget(keys: string[]) {
        return await client.mGet(keys);
    }
    async ttl(key: string) {
        return await client.ttl(key);
    }
    async exists(key: string) {
        return await client.exists(key);
    }
    async persist(key: string) {
        return await client.persist(key);
    }
    async del(key: string) {
        return await client.del(key);
    }
    async incr(key: string) {
        return await client.incr(key);
    }
    async decr(key: string) {
        return await client.decr(key);
    }
    async update(key: string, value: number) {
        if (! await this.exists(key)) { return 0; }
        await client.set(key, value)
        return 1;
    }
    async setExpire(key: string, seconds: number) {
        return await client.expire(key, seconds);
    }

    blackListTokenKey({ userId, tokenId }: { userId: string|ObjectId, tokenId: string|ObjectId }) {
        return `blackListToken::${userId}::${tokenId}`
    }
    OTP({ email, confirmation, track }: { email: string, confirmation: EmailEnum, track?: string }) {
        if (track) {
            return `OTP::${email}::${confirmation}::${track}`
        }
        return `OTP::${email}::${confirmation}`
    }
    getFcmKey(userId:Types.ObjectId |string){
        return `FCM::${userId}`
    }
    async addToSet(userId:Types.ObjectId |string , fcmToken:string){
        return await client.sAdd(this.getFcmKey(userId), fcmToken)
    }
    async getSetMembers(userId:Types.ObjectId |string){
        return await client.sMembers(this.getFcmKey(userId))
    }


}
export default new RedisService();