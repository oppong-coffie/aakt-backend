import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
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

export const Onboarding = mongoose.model("onboardings", onboardingSchema);