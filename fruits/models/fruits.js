import mongoose from "mongoose";

const fruitSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
})

export default mongoose.model("Fruit", fruitSchema);