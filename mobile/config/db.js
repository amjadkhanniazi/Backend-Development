import mongoose from "mongoose";
import config from "./config.js";

async function connectDB(){
    const client = mongoose.connect(config.mongoURI,config.options);
    try{
        await client;
        console.log("Connected to the database");
    }
    catch(err){
        console.log("Error connecting to the database",err);
    }
}

export default connectDB;