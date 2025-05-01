import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB()
{
    try
    {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("connection successful.");
    }
    catch(err)
    {
        console.log("error in connection.");
    }
}

export default connectDB;