"use server";
import nodemailer from 'nodemailer';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from 'react';
const { renderToStaticMarkup } = require("react-dom/server");

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});



export async function sendVerificationEmaill(
    email: any,
    username: any,
    verifyCode: any,
): Promise<ApiResponse> {
    try {
        const emailHtml = renderToStaticMarkup(
            React.createElement(VerificationEmail, {
                username: username,
                otp: verifyCode,
            })
        );
        const info = await transporter.sendMail({
            from: SMTP_SERVER_USERNAME,
            to: email,
            subject: 'Mystery Message | Verification Code',
            html: emailHtml,
        });
        if (info === null) {
            return { success: false, message: "Failed to send verification email" };
        }
        return { success: true, message: "Verification email successfully" };

    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}




