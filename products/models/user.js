import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});


//Hash Password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
    next();
})

//compare the hash password
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

//create token
userSchema.methods.getToken= function() {
    return jwt.sign({id: this._id, username: this.username}, process.env.SECRET_KEY,{expiresIn:'1h'});
};

export default mongoose.model('User', userSchema);