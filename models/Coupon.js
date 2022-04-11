const mongoose = require('mongoose');

var Coupon = new mongoose.Schema({
    coupon: {
        type: String,
        default: ''
    },
    createdAt: {
        type: String,
        default: ''
    },
    finishAt: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }

}, { collection: 'coupon' })

module.exports = mongoose.model('Coupon', Coupon)