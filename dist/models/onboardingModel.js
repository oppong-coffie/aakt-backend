"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onboarding = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const onboardingSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
    country: String,
    numberofbusinesses: Number,
    teamsize: String,
    referralcode: String,
    otp: String,
    stage: String,
    product: String,
    strategy: String,
    team: String,
    finance: String,
    growth: String,
    step: String,
    capital: Number,
    influence: Number,
    intel: Number,
    network: Number,
    skillset: Number,
    feeling: [Number],
    completed: {
        stage: { type: Boolean, default: false },
        skills: { type: Boolean, default: false },
        step: { type: Boolean, default: false },
        confident: { type: Boolean, default: false },
        feeling: { type: Boolean, default: false }
    }
}, { strict: false });
exports.Onboarding = mongoose_1.default.model("onboardings", onboardingSchema);
//# sourceMappingURL=onboardingModel.js.map