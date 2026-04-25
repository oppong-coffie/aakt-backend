import app from "./server";
import mongoose from "mongoose";
import { verifyEmailConnection } from "./utils/emailService";

const PORT = process.env.PORT || 3000;

// connect MongoDB

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log('SUCCESSFULLY CONNECTED TO MONGODB');
        // Verify email connection after DB is ready
        verifyEmailConnection();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});