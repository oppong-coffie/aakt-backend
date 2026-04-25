import nodemailer from 'nodemailer';

// Create a pooled transporter for better performance and reliability
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Removed spaces just in case
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
});

/**
 * Verifies the SMTP connection on startup
 */
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✓ Email service is ready to send messages');
        return true;
    } catch (error) {
        console.error('✗ Email service verification failed:', error);
        return false;
    }
};

/**
 * Sends an OTP email with retry logic
 */
export const sendOtp = async (to: string, otp: string, retries = 3) => {
    const mailOptions = {
        from: `"AAKT" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your AAKT OTP Verification Code',
        text: `Your OTP is: ${otp}. Please do not share this with anyone.`,
        html: `
            <div style="font-family: inherit; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">AAKT Verification Code</h2>
                <p style="color: #666; font-size: 16px;">Your one-time password (OTP) is:</p>
                <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
                </div>
                <p style="color: #999; font-size: 14px;">This code will expire shortly. Please do not share this with anyone.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #bbb; font-size: 12px;">This is an automated message, please do not reply.</p>
            </div>
        `,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully on attempt ${attempt}: ${info.messageId}`);
            return true;
        } catch (error: any) {
            console.error(`Attempt ${attempt} failed to send email to ${to}:`, error.message);
            
            if (attempt === retries) {
                console.error('Final attempt failed. Email delivery aborted.');
                return false;
            }
            
            // Wait before retrying (exponential backoff: 1s, 2s)
            const delay = attempt * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
};
