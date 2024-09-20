import mongoose from 'mongoose'
import config from './config.js'

async function connectDB() {
    const client= mongoose.connect(config.MongoUrl);

    try{
        await client;
        console.log('Connected to Mongo');
    }
    catch(error){
        console.log({message: 'Error connecting to Mongo', error});
    }
}

export default connectDB;