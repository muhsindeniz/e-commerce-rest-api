const mongoose = require('mongoose');

var Admin = new mongoose.Schema({
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
    roles: {
        type: String,
        default: "admin"
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
}, { collection: 'admin' })

module.exports = mongoose.model('Admin', Admin)