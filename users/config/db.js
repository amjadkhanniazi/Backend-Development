import mongoose from "mongoose";
import config from "./config.js";


async function ConnectDB() {

    const client=mongoose.connect(config.mongoURI,config.options);

    try{
        await client;
        console.log('DB Connected');
        
    } catch(err){
        console.error('Error connected to DB',err);
    }
}

export default ConnectDB;