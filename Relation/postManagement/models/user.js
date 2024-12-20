const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'admin'
  }
});

userSchema.index({username: 1});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Virtual field to get the products for a user (for ease of querying)
userSchema.virtual('post', {
    ref: 'post',
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

module.exports = mongoose.model('User', userSchema);