const mongoose = require('mongoose');
require('dotenv').config();
const { Onboarding } = require('./dist/models/onboardingModel.js');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const updateData = { stage: 'Test' };
        const userId = new mongoose.Types.ObjectId();
        const onboarding = await Onboarding.findOneAndUpdate(
            { userId },
            { 
               $set: updateData,
               $setOnInsert: {
                   "completed.stage": false,
                   "completed.skills": false,
                   "completed.step": false,
                   "completed.confident": false,
                   "completed.feeling": false
               }
            },
            { returnDocument: 'after', upsert: true, runValidators: true }
        );
        console.log('SUCCESS:', onboarding);
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await mongoose.disconnect();
    }
}
run();
