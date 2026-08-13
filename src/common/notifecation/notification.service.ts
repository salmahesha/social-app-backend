import admin from "firebase-admin"
import { readFileSync } from "node:fs";
import path from "node:path";
class NotificationService{

private _serviceAccount = JSON.parse(readFileSync(path.resolve("social-media-app-160e0-firebase-adminsdk-fbsvc-0155dffb26.json")) as unknown as string)
private _client!: admin.app.App
constructor(){

    admin.initializeApp({
      credential: admin.credential.cert(this._serviceAccount)
    });
}
async sendNotification({token , data}:{token:string , data:{title:string , body:string}}){
   return await this._client.messaging().send({token , data});
}
async sendNotifications({tokens , data}:{tokens:string[] , data:{title:string , body:string}}){
//    return await this._client.messaging().send({tokens , data});
return await Promise.all(tokens.map((token)=>{
    return this.sendNotification({token , data})
}))
}

}
export default new NotificationService;