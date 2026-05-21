import { Request, Response } from 'express';
import { User } from '../models/userModels';
import { Onboarding } from '../models/onboardingModel';
import { Business } from '../models/portfolioModel';

/**
 * Get all registered users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Debug: log the collection name Mongoose is querying
        console.log('Mongoose collection name:', User.collection.name);
        
        const users = await User.find().select('-password'); // Exclude password hashes for security
        
        // Debug: log what we got back
        console.log('Users found:', users.length, users);

        // Prevent 304 cached responses
        res.set('Cache-Control', 'no-store');
        res.removeHeader('ETag');
        
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message
        });
    }
};

/**
 * Get all onboarding records (which contains numberofbusinesses, etc.)
 */
export const getAllOnboardings = async (req: Request, res: Response): Promise<void> => {
    try {
        const onboardings = await Onboarding.find();
        
        res.set('Cache-Control', 'no-store');
        res.removeHeader('ETag');
        
        res.status(200).json({
            message: 'Onboardings retrieved successfully',
            data: onboardings
        });
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message
        });
    }
};

/**
 * Get all businesses from portfolio
 */
export const getAllBusinesses = async (req: Request, res: Response): Promise<void> => {
    try {
        const businesses = await Business.find();
        
        res.set('Cache-Control', 'no-store');
        res.removeHeader('ETag');
        
        res.status(200).json({
            message: 'Businesses retrieved successfully',
            data: businesses
        });
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message
        });
    }
};

