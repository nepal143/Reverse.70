// modules/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        description: "The full name of the user."
    },
    username: {
        type: String,
        required: true,
        description: "The username chosen by the user."
    },
    email: {
        type: String,
        required: true,
        unique: true,
        description: "The email address of the user."
    },
    Alternate:{
        type: String, 
    },
    phoneNumber: {
        type: String,
        required : true, 
        description: "The phone number of the user."
    },
    College: {
        type: String,
        required: true,
        description: "The password chosen by the user."
    },
    upiId: {
        type: String ,
      }
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
    // try {
    //     const salt = await bcrypt.genSalt(10);
    //     const hashedPassword = await bcrypt.hash(this.password, salt);
    //     this.password = hashedPassword;
    //     next();
    // } catch (error) {
    //     next(error);
    // }
});

const User = mongoose.model('User', userSchema);

module.exports = User;  
