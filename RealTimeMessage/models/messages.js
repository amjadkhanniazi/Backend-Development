import mongoose from "mongoose";
import 'dotenv/config';

const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: { 
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Message', messageSchema);
