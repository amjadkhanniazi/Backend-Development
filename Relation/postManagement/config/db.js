const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB() {
    const client = mongoose.connect(config.mongoURL);
    try{
        await client;
        console.log('Connected  to MongoDB');
    }
    catch(err){
        console.log({message:'Error Connecting to DB', error:err});
    }
}

module.exports = connectDB;