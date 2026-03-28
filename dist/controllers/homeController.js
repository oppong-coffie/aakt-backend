"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletedStatus = void 0;
const onboardingModel_1 = require("../models/onboardingModel");
const getCompletedStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOne({ userId });
        if (onboarding) {
            res.status(200).json({ completed: onboarding.completed || {} });
        }
        else {
            res.status(404).json({ message: "Onboarding data not found" });
        }
    }
    catch (error) {
        console.error("Error fetching completed status:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getCompletedStatus = getCompletedStatus;
//# sourceMappingURL=homeController.js.map