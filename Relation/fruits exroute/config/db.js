import mongoose from 'mongoose';
import config from './config.js';


async function connectDB() {
    const client = mongoose.connect(config.MongoUrl,config.options);
        try{
            await client;
            console.log('Connected to database');
        }
        catch(err){
            console.log({message:"Error Connecting to Database",err});
        }
    
}

export default connectDB;