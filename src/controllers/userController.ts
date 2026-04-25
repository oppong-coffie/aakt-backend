import { Request, Response } from 'express';
import { User } from '../models/userModels';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from '../config/googleOAuth';
import bcrypt from 'bcryptjs';

// START:: Get all users
const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Fetch all users successfully', data: users });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get all users

// START:: Get user by id
const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ message: `Fetch user with id: ${user}` });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get user by id

// START:: Custom Create user
const createUser = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;
    try {
        const user = await User.create({ fullName, email, password });

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(201).json({ message: 'User created successfully', token, data: user });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Custom Create user

// START:: Update user
const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { fullName, email, password } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({ message: `User with id: ${id} updated successfully`, data: user });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Update user

// START:: Delete user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        res.status(200).json({ message: `User with id: ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Delete user

// START:: Custom Login user
const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token, data: user });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Custom Login user

// START:: Google Login
const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;
    try {
        if (!idToken) {
            res.status(400).json({ error: 'Google ID token is required' });
            return;
        }

        // Verify Google ID token
        const googleUserData = await verifyGoogleToken(idToken);

        // Check if user exists
        let user = await User.findOne({ email: googleUserData.email });

        if (!user) {
            res.status(404).json({ 
                error: 'User not found. Please register first with Google OAuth.',
                details: { email: googleUserData.email }
            });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            message: 'Google login successful', 
            token, 
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ 
            error: 'Google authentication failed',
            details: (error as Error).message 
        });
    }
};
// END:: Google Login

// START:: Google Register
const googleRegister = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;
    try {
        if (!idToken) {
            res.status(400).json({ error: 'Google ID token is required' });
            return;
        }

        // Verify Google ID token
        const googleUserData = await verifyGoogleToken(idToken);

        // Check if user already exists
        let user = await User.findOne({ email: googleUserData.email });
        
        if (user) {
            res.status(400).json({ 
                error: 'User already exists. Please login instead.',
                details: { email: googleUserData.email }
            });
            return;
        }

        // Create new user with Google data
        // Generate random password since it's required in schema but not used for OAuth
        const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);

        user = await User.create({ 
            fullName: googleUserData.fullName || 'Google User',
            email: googleUserData.email, 
            password: randomPassword 
        });

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: 'Google registration successful', 
            token, 
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ 
            error: 'Google registration failed',
            details: (error as Error).message 
        });
    }
};
// END:: Google Register

export { getUsers, getUserById, createUser, updateUser, deleteUser, login, googleLogin, googleRegister };
