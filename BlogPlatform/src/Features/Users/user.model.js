const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const detenv = require('dotenv');

detenv.config();

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Virtual field to get the products for a user (for ease of querying)
userSchema.virtual('blog', {
    ref: 'blog',
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


const User = mongoose.model('User', userSchema);
module.exports = User;