import { Response } from 'express';
import { UserSlide } from '../models/userSlideModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createSlideDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, slides } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        const newDeck = new UserSlide({
            userId,
            title,
            slides: slides || [
                {
                    id: '1',
                    content: '<h1>Title Slide</h1><p>Welcome to your new presentation</p>',
                    background: '#191919'
                }
            ]
        });

        const savedDeck = await newDeck.save();
        res.status(201).json(savedDeck);
    } catch (error) {
        console.error('Error creating UserSlide:', error);
        res.status(500).json({ error: 'Failed to create slide deck' });
    }
};

export const getSlideDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const decks = await UserSlide.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(decks);
    } catch (error) {
        console.error('Error fetching UserSlides:', error);
        res.status(500).json({ error: 'Failed to fetch slide decks' });
    }
};

export const updateSlideDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, slides } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedDeck = await UserSlide.findOneAndUpdate(
            { _id: id, userId },
            { title, slides },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedDeck) {
            res.status(404).json({ error: 'Slide deck not found' });
            return;
        }

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error('Error updating UserSlide:', error);
        res.status(500).json({ error: 'Failed to update slide deck' });
    }
};

export const deleteSlideDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedDeck = await UserSlide.findOneAndDelete({ _id: id, userId });

        if (!deletedDeck) {
            res.status(404).json({ error: 'Slide deck not found' });
            return;
        }

        res.status(200).json({ message: 'Slide deck deleted successfully' });
    } catch (error) {
        console.error('Error deleting UserSlide:', error);
        res.status(500).json({ error: 'Failed to delete slide deck' });
    }
};
