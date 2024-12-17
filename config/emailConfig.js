import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SEND_OTP_EMAIL,
        pass: process.env.SEND_OTP_EMAIL_PASS,
    },
});

export default transporter;