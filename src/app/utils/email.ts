/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailder from "nodemailer"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs"
import { sendEmailInterface } from "../interface/sendEmail.interface";

const transporter = nodemailder.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT)
});

export const sendEmail = async ({ subject, templeteData, templeteName, to, attachments }: sendEmailInterface) => {
    try {
        const templetePath = path.resolve(process.cwd(), `src/app/templetes/${templeteName}.ejs`);
        const html = await ejs.renderFile(templetePath, templeteData);
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachmet) => ({
                filename: attachmet.filename,
                content: attachmet.content,
                contentType: attachmet.contentType
            }))
        });
        console.log(`Email send ${to}: ${info.messageId}`)
    } catch (error: any) {
        console.log("Email sending error", error.message);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Faield to send email");
    }
}