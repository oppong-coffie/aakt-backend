import { Request, Response } from 'express';
import { User } from '../models/userModels';
import { Admin } from '../models/adminModel';
import { AdminWorkload } from '../models/adminWorkloadModel';
import { Onboarding } from '../models/onboardingModel';
import { Business } from '../models/portfolioModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Admin Register
 */
export const adminRegister = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ error: 'Admin with this email already exists' });
            return;
        }

        // Create admin in DB (password is hashed via pre-save hook)
        const admin = await Admin.create({ fullName, email, password });

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            data: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error: any) {
        console.error('Error in adminRegister:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Admin Login
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(404).json({ error: 'Admin not found' });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Admin login successful',
            token,
            data: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error: any) {
        console.error('Error in adminLogin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

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

/**
 * Create a new admin workload
 */
export const createAdminWorkload = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    try {
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const workload = await AdminWorkload.create({ name, tasks: [] });

        res.status(201).json({
            message: 'Admin workload created successfully',
            data: workload,
        });
    } catch (error: any) {
        console.error('Error in createAdminWorkload:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Create a task inside an admin workload
 */
export const createAdminTask = async (req: Request, res: Response): Promise<void> => {
    const { workloadId } = req.params;
    const { name, status } = req.body;

    try {
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const workload = await AdminWorkload.findById(workloadId);
        if (!workload) {
            res.status(404).json({ error: 'Admin workload not found' });
            return;
        }

        workload.tasks.push({ name, status: status || 'Todo' });
        await workload.save();

        res.status(201).json({
            message: 'Admin task created successfully',
            data: workload,
        });
    } catch (error: any) {
        console.error('Error in createAdminTask:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Delete an admin workload
 */
export const deleteAdminWorkload = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deleted = await AdminWorkload.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Admin workload not found' });
            return;
        }

        res.status(200).json({ message: 'Admin workload deleted successfully' });
    } catch (error: any) {
        console.error('Error in deleteAdminWorkload:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Edit an admin workload (update name)
 */
export const editAdminWorkload = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const workload = await AdminWorkload.findByIdAndUpdate(
            id,
            { name },
            { returnDocument: 'after' }
        );

        if (!workload) {
            res.status(404).json({ error: 'Admin workload not found' });
            return;
        }

        res.status(200).json({
            message: 'Admin workload updated successfully',
            data: workload,
        });
    } catch (error: any) {
        console.error('Error in editAdminWorkload:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Delete a task from an admin workload
 */
export const deleteAdminTask = async (req: Request, res: Response): Promise<void> => {
    const { workloadId, taskId } = req.params;

    try {
        const workload = await AdminWorkload.findById(workloadId);
        if (!workload) {
            res.status(404).json({ error: 'Admin workload not found' });
            return;
        }

        const initialCount = workload.tasks.length;
        workload.tasks = workload.tasks.filter((task: any) => task._id.toString() !== taskId);

        if (workload.tasks.length === initialCount) {
            res.status(404).json({ error: 'Task not found in workload' });
            return;
        }

        await workload.save();

        res.status(200).json({
            message: 'Admin task deleted successfully',
            data: workload,
        });
    } catch (error: any) {
        console.error('Error in deleteAdminTask:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * Change admin task status
 */
export const changeAdminTaskStatus = async (req: Request, res: Response): Promise<void> => {
    const { workloadId, taskId } = req.params;
    const { status } = req.body;

    try {
        if (!status) {
            res.status(400).json({ error: 'status is required' });
            return;
        }

        const workload = await AdminWorkload.findById(workloadId);
        if (!workload) {
            res.status(404).json({ error: 'Admin workload not found' });
            return;
        }

        const task = workload.tasks.find((t: any) => t._id.toString() === taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found in workload' });
            return;
        }

        task.status = status;
        await workload.save();

        res.status(200).json({
            message: 'Admin task status updated successfully',
            data: workload,
        });
    } catch (error: any) {
        console.error('Error in changeAdminTaskStatus:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
