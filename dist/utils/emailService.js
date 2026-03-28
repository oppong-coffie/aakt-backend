"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Removed spaces just in case
    },
});
const sendOtp = async (to, otp) => {
    try {
        const mailOptions = {
            from: `"AAKT" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Your AAKT OTP Verification Code',
            text: `Your OTP is: ${otp}. Please do not share this with anyone.`,
            html: `
                <div style="font-family: inherit; max-width: 600px; margin: 0 auto;">
                    <h2>AAKT Verification Code</h2>
                    <p>Your one-time password (OTP) is:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire shortly. Please do not share this with anyone.</p>
                </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    }
    catch (error) {
        console.error('Error sending email: ', error);
        return false;
    }
};
exports.sendOtp = sendOtp;
//# sourceMappingURL=emailService.js.map