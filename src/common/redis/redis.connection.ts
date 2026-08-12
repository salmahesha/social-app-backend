import { createClient } from "redis"
import { REDIS_URL } from "../../config/config.service";

export const client = createClient({
  url: REDIS_URL
});

export async function testRedisConnection(){

    try {
        client.on("error", (err) => {
    console.error("Redis Error:", err);
});

client.on("end", () => {
    console.log("Redis connection closed");
});

client.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});
        await client.connect();
        console.log("Redis Connected");
        
    } catch (error) {
        console.log("Connection Error : " , error);
        
    }
}