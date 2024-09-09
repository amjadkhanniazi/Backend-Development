import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    }
})

//hash password before saving
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//create token
userSchema.methods.getToken= function() {
    return jwt.sign({id: this._id, username: this.username}, process.env.SECRET_KEY,{expiresIn:'1h'});
};

export default mongoose.model('User', userSchema);