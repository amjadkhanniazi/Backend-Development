import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testname: {
        type: String,
        required: true
    },
    testdate: {
        type: String,
        required: true
    },
    testtime: {
        type: String,
        required: true
    },
    testduration: {
        type: Number,
        required: true
    },
    totalmarks: {
        type: Number,
        required: true
    },
    remarks:{
        type: String
    }
})

export default mongoose.model('Test', testSchema);