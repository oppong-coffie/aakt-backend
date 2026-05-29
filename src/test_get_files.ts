import mongoose from 'mongoose';
import { UserFile } from './models/userFileModel';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function test() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        console.log('Querying UserFiles...');
        const files = await UserFile.find({});
        console.log('Files retrieved:', files);

        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

test();
