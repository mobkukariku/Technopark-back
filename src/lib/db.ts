import * as mongoose from "mongoose";

export const connectToDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
}