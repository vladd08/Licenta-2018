var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    password: {
        type: String,
        required: true,
      },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    cnp: {
        type: String,
        length: 13
    },
    position: {
        type: String
    },
    sex: { // 0 - F , 1 - M
        type: Boolean,
        required: true
    },
    address: {
        type: String
    },
    role: { // 1 - ADMIN , 2 - PM , 3 - OM , 4 - ANG
        type: Number
    },
    accessCard: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date
    }
});
module.exports = UserSchema;