import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    const client= mongoose.connect(config.MongoURL,config.options);
    try{
        await client;
        console.log('Connected to the database');
    }
    catch (error){
        console.log('Error connecting to the database');
    }
}

export default connectDB;