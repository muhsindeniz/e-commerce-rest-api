const mongoose = require('mongoose');

let User = mongoose.Schema({
    name: {
        type: String,
        min: 6,
        max: 255,
        default: ""
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        default: ""
    },
    password: {
        type: String,
        min: 6,
        max: 1024
    },
    gender: {
        type: String,
        default: ""
    },
    birthdayString: {
        type: String,
        default: ""
    },
    roles: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
        default: ""
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', User)