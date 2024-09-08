import mongoose from "mongoose";

const animalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
})

export default mongoose.model('Animals', animalSchema);