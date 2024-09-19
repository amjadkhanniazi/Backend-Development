import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import testAPIs from "./routes/testAPIs.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use('/auth',auth);
app.use('/test',testAPIs);


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});