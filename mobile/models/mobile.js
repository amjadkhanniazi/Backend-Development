import mongoose from "mongoose";

const mobileSchema = mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    isSmart: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Mobile", mobileSchema);