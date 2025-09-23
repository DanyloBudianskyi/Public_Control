import mongoose from "mongoose";

export async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/control_db');
        console.log('🟢 Connected to MongoDB successful')
    }catch (error){
        console.error('🔴 MongoDB connection error: ', error);
        process.exit(1);
    }
}
