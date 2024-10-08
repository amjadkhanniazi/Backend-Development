import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
       // select: false -->when uncommented, it response this error at login on postman--("error": "Illegal arguments: string, undefined")
    },
    role: { 
        type: String,
        enum: ['user', 'editor', 'admin'],
        default: 'user'
    }
})


// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Virtual field to get the products for a user (for ease of querying)
userSchema.virtual('fruits', {
    ref: 'fruits',
    localField: '_id',
    foreignField: 'user'
});

userSchema.methods.getRole = function() {
    return this.role;
  };

// Compare hashed password
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getToken = function() {
    return jwt.sign({ id: this._id, username: this.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
};


export default mongoose.model('User',userSchema);

