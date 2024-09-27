const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: Number,
  userName: String,
  email: String,
  password: String, // This should be the hashed password
  role: { type: String, default: 'user' } // Default role for new users
});

// Method to compare provided password with stored hashed password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password); // Comparing the hashed password
};

const User = mongoose.model('User', userSchema);

module.exports = User;
