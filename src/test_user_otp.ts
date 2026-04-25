import mongoose from 'mongoose';
import { User } from './models/userModels';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function test() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        const testEmail = `test_${Date.now()}@example.com`;
        const testOtp = '1234';

        console.log(`Creating user with email: ${testEmail} and OTP: ${testOtp}`);
        const user = await User.create({
            fullName: `Test User ${Date.now()}`,
            email: testEmail,
            password: 'password123',
            otp: testOtp
        });

        console.log('User created:', user);
        console.log('OTP in returned object:', user.otp);

        const fetchedUser = await User.findById(user._id);
        console.log('Fetched user from DB:', fetchedUser);
        console.log('OTP in DB:', fetchedUser?.otp);

        if (fetchedUser?.otp === testOtp) {
            console.log('SUCCESS: OTP was saved to DB.');
        } else {
            console.log('FAILURE: OTP was NOT saved to DB.');
        }

        // Clean up
        await User.findByIdAndDelete(user._id);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Test failed with error:', error);
        process.exit(1);
    }
}

test();
