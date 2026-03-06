import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

configDotenv()

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.GMAIL_PASS, 
            },
        });

        const info = await transporter.sendMail({
            from: '"Your E-commerce Store" <no-reply@example.com>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

export default sendEmail;