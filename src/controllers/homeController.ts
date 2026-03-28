import { Response } from "express";
import { Onboarding } from "../models/onboardingModel";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getCompletedStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const onboarding = await Onboarding.findOne({ userId });
        if (onboarding) {
            res.status(200).json({ completed: onboarding.completed || {} });
        } else {
            res.status(404).json({ message: "Onboarding data not found" });
        }
    } catch (error) {
        console.error("Error fetching completed status:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
