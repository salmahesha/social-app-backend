import nodemailer from "nodemailer";
import { USER_MAIL, USER_PASS } from "../../config/config.service";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user:USER_MAIL ,
    pass: USER_PASS,
  },
});




export async function sendMail({from , to , subject , text , html}:{from?:string , to:string , subject?:string , text:string , html?:string}){
     const info = await transporter.sendMail({
    from: from || USER_MAIL, // sender address
    to: to, // list of recipients
    subject: subject, // subject line
    text:text, // plain text body
    html:html, // HTML body
  });

}