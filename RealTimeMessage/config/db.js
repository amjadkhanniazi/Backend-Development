import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {

    const client = mongoose.connect(config.MongoURL);
    try {
        await client;
        console.log("Connected to database");
    }
    catch (err) {
        console.log(err);
    }
}

export default connectDB;