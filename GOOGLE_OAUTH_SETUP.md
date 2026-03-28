# Google OAuth Implementation Guide

## Overview
This backend now supports Google OAuth for user registration and login using Google ID tokens with proper OAuth Provider initialization.

## What's New

### 1. **Google OAuth Configuration** (`src/config/googleOAuth.ts`)
   - Initializes `OAuth2Client` from `google-auth-library`
   - Verifies Google ID tokens securely
   - Extracts user information from verified tokens
   - Provides helper functions for OAuth flow management

### 2. **Updated User Controller**
   - `googleLogin()`: Verifies Google ID token and logs in existing users
   - `googleRegister()`: Verifies Google ID token and creates new users
   - Proper error handling and validation

### 3. **Server Initialization**
   - Google OAuth Provider initialized on server startup
   - Environment variables validation with helpful warnings

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

The `google-auth-library` has been added to `package.json`.

### Step 2: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Create OAuth 2.0 credentials (OAuth consent screen + OAuth 2.0 Client ID)
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production domain
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google-callback`
   - Your production callback URL

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and fill in the credentials:

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google-callback
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

### POST /auth/google-register
Register a new user with Google OAuth
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Response:**
```json
{
  "message": "Google registration successful",
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@gmail.com"
  }
}
```

### POST /auth/google-login
Login an existing user with Google OAuth
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Response:**
```json
{
  "message": "Google login successful",
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@gmail.com"
  }
}
```

## Client-Side Integration

### Using Google Sign-In Button

```html
<!-- Add Google Sign-In script -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Google Sign-In Button -->
<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>

<script>
  function handleCredentialResponse(response) {
    // Send the ID token to your backend
    fetch('/auth/google-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: response.credential })
    })
    .then(res => res.json())
    .then(data => {
      // Save the JWT token
      localStorage.setItem('jwtToken', data.token);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    })
    .catch(error => console.error('Error:', error));
  }
</script>
```

## Security Features

✓ **Token Verification**: ID tokens are cryptographically verified using Google's public keys
✓ **Audience Validation**: Tokens are validated against your CLIENT_ID
✓ **Email Verification**: Only verified Google emails are accepted
✓ **Password-Free JWT**: Users authenticate via Google, JWT for session management
✓ **Error Handling**: Comprehensive error messages for debugging

## Troubleshooting

### "Google OAuth environment variables are not set"
Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in your `.env` file.

### "Invalid token payload"
The ID token might be expired or invalid. Ensure the token is fresh and sent immediately after Google Sign-In.

### "User not found. Please register first"
Use `/auth/google-register` endpoint for new users first before attempting login.

### "User already exists"
The email is already registered. Use `/auth/google-login` instead if you have an existing account.

## Production Considerations

1. **Update Callback URL**: Change `GOOGLE_CALLBACK_URL` to your production domain
2. **JWT Secret**: Use a strong, random `JWT_SECRET` in production
3. **HTTPS Only**: Ensure all OAuth traffic uses HTTPS in production
4. **Token Expiry**: `.expiresIn: '1d'` can be adjusted based on your security requirements
5. **CORS**: Update CORS configuration to allow requests from your frontend domain

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [google-auth-library Documentation](https://github.com/googleapis/google-auth-library-nodejs)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
