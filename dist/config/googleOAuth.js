"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokensFromCode = exports.getAuthorizationUrl = exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
// Initialize Google OAuth2 Client
const googleOAuthClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID || '', process.env.GOOGLE_CLIENT_SECRET || '', process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google-callback');
/**
 * Verify Google ID Token and extract user information
 * @param idToken - The Google ID token from the client
 * @returns User info from the verified token (email, fullName, picture)
 */
const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await googleOAuthClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid token payload');
        }
        return {
            email: payload.email || '',
            fullName: payload.name || '',
            picture: payload.picture || null,
            googleId: payload.sub,
            verified: payload.email_verified || false,
        };
    }
    catch (error) {
        throw new Error(`Google OAuth verification failed: ${error.message}`);
    }
};
exports.verifyGoogleToken = verifyGoogleToken;
/**
 * Get authorization URL for OAuth flow
 * @returns Authorization URL
 */
const getAuthorizationUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ];
    return googleOAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });
};
exports.getAuthorizationUrl = getAuthorizationUrl;
/**
 * Exchange authorization code for tokens
 * @param code - Authorization code from Google
 * @returns Access token and related information
 */
const getTokensFromCode = async (code) => {
    try {
        const { tokens } = await googleOAuthClient.getToken(code);
        return tokens;
    }
    catch (error) {
        throw new Error(`Failed to exchange authorization code: ${error.message}`);
    }
};
exports.getTokensFromCode = getTokensFromCode;
exports.default = googleOAuthClient;
//# sourceMappingURL=googleOAuth.js.map