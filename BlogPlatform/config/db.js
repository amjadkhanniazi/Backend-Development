import mongoose from "mongoose";
import config from "./config.js";

async  function connectDB() {
    const client = mongoose.connect(config.MongoURL);
    try{
        await client;
        console.log('Connected  to MongoDB');
    }
    catch(err){
        console.log({message:'Error Connecting to DB', error:err});
    }
}

export default connectDB;
