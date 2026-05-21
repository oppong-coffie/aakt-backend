import dotenv from 'dotenv';
dotenv.config({ override: true });
import app from "./server";
import mongoose from "mongoose";
import { verifyEmailConnection } from "./utils/emailService";

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

function getMongoConnectionHint(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (/ECONNREFUSED|localhost:27017|127\.0\.0\.1:27017|\[?::1\]?:27017/i.test(message)) {
        return [
            "Local MongoDB is not running on localhost:27017.",
            "Start MongoDB locally, or change MONGODB_URI to a reachable database.",
            "On macOS with Homebrew, install/start it with: brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community.",
        ].join(" ");
    }

    if (/whitelist|Atlas cluster|ReplicaSetNoPrimary|server selection/i.test(message)) {
        return [
            "MongoDB Atlas refused the connection.",
            "If you are using Atlas, add your current IP address to Network Access in the Atlas dashboard.",
            "For local development, set MONGODB_URI=mongodb://localhost:27017/aakt and make sure MongoDB is running.",
        ].join(" ");
    }

    return "Check that MONGODB_URI is correct and that the database is reachable.";
}

async function startServer() {
    if (!mongoUri) {
        console.error("MONGODB_URI is not set. Add it to aakt-backend/.env before starting the server.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('SUCCESSFULLY CONNECTED TO MONGODB');
        verifyEmailConnection();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.error(getMongoConnectionHint(error));
        process.exit(1);
    }
}

startServer();
