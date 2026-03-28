"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendFeeling = exports.sendConfident = exports.sendStep = exports.sendSkills = exports.sendStage = exports.getOnboarding = exports.sendOtpEmail = exports.createOrUpdateOnboarding = void 0;
const onboardingModel_1 = require("../models/onboardingModel");
const emailService_1 = require("../utils/emailService");
// START:: Create or update onboarding
const createOrUpdateOnboarding = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updateData = { ...req.body };
        // Remove legacy 'completed' number from payload if the frontend sends it
        delete updateData.completed;
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, {
            $set: updateData,
            $setOnInsert: {
                "completed.stage": false,
                "completed.skills": false,
                "completed.step": false,
                "completed.confident": false,
                "completed.feeling": false
            }
        }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Onboarding saved successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in createOrUpdateOnboarding:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.createOrUpdateOnboarding = createOrUpdateOnboarding;
// END:: Create or update onboarding
// START:: Send otp email
const sendOtpEmail = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const email = req.user?.email;
        if (!email) {
            res.status(400).json({ message: "Email not found in token" });
            return;
        }
        // Generate otp code
        const generateOtpCode = () => {
            return Math.floor(1000 + Math.random() * 9000).toString();
        };
        const otp = generateOtpCode();
        const emailSent = await (0, emailService_1.sendOtp)(email, otp);
        if (emailSent) {
            // Save the OTP to the onboarding document for later verification
            await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { otp }, $unset: { opt: 1 } }, { returnDocument: 'after', upsert: true, runValidators: true });
            res.status(200).json({ message: `OTP sent successfully to ${email}` });
        }
        else {
            res.status(500).json({ message: "Failed to send OTP email" });
        }
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendOtpEmail = sendOtpEmail;
// END:: Send otp email
// START:: Send stage
const sendStage = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { stage } = req.body;
        if (!stage) {
            res.status(400).json({ message: "Stage is required in the request body" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { stage: stage, "completed.stage": true } }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Stage updated successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in sendStage:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendStage = sendStage;
// END:: Send stage
// START:: Send skills
const sendSkills = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { skills } = req.body;
        const { product, strategy, team, finance } = skills || {};
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { product, strategy, team, finance, "completed.skills": true } }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Skills updated successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in sendSkills:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendSkills = sendSkills;
// END:: Send skills
// START:: Send step
const sendStep = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { step } = req.body;
        if (!step) {
            res.status(400).json({ message: "Step is required in the request body" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { step: step, "completed.step": true } }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Step updated successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in sendStep:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendStep = sendStep;
// END:: Send step
// START:: Send confident
const sendConfident = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { confident } = req.body;
        const values = {
            skillset: confident?.skillset ?? confident?.Skillset,
            network: confident?.network ?? confident?.Network,
            capital: confident?.capital ?? confident?.Capital,
            intel: confident?.intel ?? confident?.Intel,
            influence: confident?.influence ?? confident?.Influence,
        };
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { confident: values, "completed.confident": true } }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Confident data updated successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in sendConfident:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendConfident = sendConfident;
// END:: Send confident
// START:: Send feeling
const sendFeeling = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { feeling } = req.body;
        if (!feeling || !Array.isArray(feeling)) {
            res.status(400).json({ message: "Feeling array is required in the request body" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOneAndUpdate({ userId }, { $set: { feeling: feeling, "completed.feeling": true } }, { returnDocument: 'after', upsert: true, runValidators: true });
        res.status(200).json({
            message: "Feeling updated successfully",
            data: onboarding
        });
    }
    catch (error) {
        console.error("Error in sendFeeling:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.sendFeeling = sendFeeling;
// END:: Send feeling
// START:: Get onboarding
const getOnboarding = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOne({ userId });
        if (onboarding) {
            res.status(200).json(onboarding);
        }
        else {
            res.status(404).json({ message: "Onboarding data not found" });
        }
    }
    catch (error) {
        console.error("Error fetching onboarding:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getOnboarding = getOnboarding;
// END:: Get onboarding
// START:: Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { otp } = req.body;
        if (!otp) {
            res.status(400).json({ message: "OTP is required in the request body" });
            return;
        }
        const onboarding = await onboardingModel_1.Onboarding.findOne({ userId });
        if (!onboarding) {
            res.status(404).json({ message: "Onboarding data not found" });
            return;
        }
        // Check if the OTP matches (handle loose equality in case of string/number casting)
        if (onboarding.get('otp') == otp || onboarding.get('opt') == otp) {
            res.status(200).json({ message: "OTP verified successfully" });
        }
        else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=onboardingController.js.map