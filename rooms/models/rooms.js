import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Room", roomSchema);