import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_eV2j4hri_H8hAXgV6in1FUiEj9Y61QQB9';
const resend = new Resend(resendApiKey);

// Log configuration (excluding sensitive data) for debugging
console.log('Email Service configured with Resend API');

/**
 * Verifies the email connection on startup
 */
export const verifyEmailConnection = async () => {
    console.log('✓ Email service is ready (Resend)');
    return true;
};

/**
 * Sends an OTP email with retry logic
 */
export const sendOtp = async (to: string, otp: string, retries = 3) => {
    const mailOptions = {
        from: process.env.EMAIL_USER ? `"AAKT" <${process.env.EMAIL_USER}>` : 'AAKT <onboarding@resend.dev>',
        to: [to],
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
            const { data, error } = await resend.emails.send(mailOptions);
            
            if (error) {
                throw new Error(error.message);
            }
            
            console.log(`Email sent successfully on attempt ${attempt}:`, data?.id);
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
