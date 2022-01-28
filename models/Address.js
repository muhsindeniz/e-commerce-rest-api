const mongoose = require('mongoose');

var Address = new mongoose.Schema({
    id: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        max: 255,
        default: ""
    },
    province: {
        type: String,
        max: 255,
        default: ""
    },
    district: {
        type: String,
        max: 255,
        default: ""
    },
    address: {
        type: String,
        max: 500,
        default: ""
    },
    addressTitle: {
        type: String,
        max: 255,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    }
}, { collection: 'address' })

module.exports = mongoose.model('Address', Address)