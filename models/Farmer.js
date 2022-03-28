const mongoose = require('mongoose');

let Farmer = mongoose.Schema({
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
    gender: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    roles: {
        type: String,
        default: "farmer"
    },
    avatar: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Farmer', Farmer)