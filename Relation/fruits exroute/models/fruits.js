import mongoose from "mongoose";

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priceKG: {
        type: Number,
        required: true
    },
    quantityKG:{
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

export default mongoose.model('fruits', fruitSchema);