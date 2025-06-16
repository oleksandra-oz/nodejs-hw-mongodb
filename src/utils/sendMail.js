import nodemailer from "nodemailer";
import { getEnvVar } from "./getEnvVar.js";

const transport = nodemailer.createTransport({
    host: getEnvVar("SMTP_HOST"),
    port: getEnvVar("SMTP_PORT"),
    secure: false,
    auth:{
        user: getEnvVar("SMTP_LOGIN"),
        pass: getEnvVar("SMTP_AUTH_PWD"),
    }
});

export function sendMail(to, subject, html) {
    return transport.sendMail({
        from: getEnvVar("EMAIL_FROM"),
        to,
        subject,
        html
    });
};