import { connect } from "mongoose";
import { DB_URL_LOCAL } from "../../config/config.service";
export async function testDBConnection(){
    try {
        await connect(DB_URL_LOCAL);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("Failed to connect" , error);
        
    }
}