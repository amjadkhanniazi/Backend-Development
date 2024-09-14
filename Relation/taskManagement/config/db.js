import mongoose from "mongoose";
import config from "./config.js";
import 'dotenv/config';

async function connectDB(){
    const client= mongoose.connect(config.MongoURL)

    try{
        await client;
        console.log('Connected to the database');
    }
    catch(err){
        console.log({
            message:'Error connecting to the database',
            error: err
        });
    }
}

export default connectDB;