import mongoose, { Schema } from "mongoose";

const fileSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true

    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export default mongoose.model('File', fileSchema);