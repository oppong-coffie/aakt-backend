import { Response } from 'express';
import { Contact } from '../models/contactModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, role, email, phone, bio, avatar, imageUrl } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!name || !role) {
            res.status(400).json({ error: 'Name and Role are required' });
            return;
        }

        // Generate a Dicebear avatar url if not provided
        const generatedAvatar = imageUrl || avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

        const newContact = new Contact({
            userId,
            name,
            role,
            email,
            phone,
            bio,
            avatar: generatedAvatar,
            imageUrl
        });

        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
};

export const getContacts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const contacts = await Contact.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

export const updateContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, role, email, phone, bio, avatar, imageUrl } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedContact = await Contact.findOneAndUpdate(
            { _id: id, userId },
            { name, role, email, phone, bio, avatar, imageUrl },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedContact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedContact = await Contact.findOneAndDelete({ _id: id, userId });

        if (!deletedContact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
};
