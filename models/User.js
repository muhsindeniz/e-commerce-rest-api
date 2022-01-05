const mongoose = require('mongoose');

let User = mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 1024
    },
    gender: {
        type: String,
        require: true
    },
    roles: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', User)