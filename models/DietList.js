const mongoose = require('mongoose');

var DietList = new mongoose.Schema({
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String
    },
    drName: {
        type: String
    },
    email: {
        type: String
    }

}, { collection: 'dietList' })

module.exports = mongoose.model('DietList', DietList)