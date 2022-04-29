const mongoose = require('mongoose');

var Subscribe = new mongoose.Schema({
    userId: {
        type: String
    },
    email: {
        type: String
    }
}, { collection: 'subscribe' })

module.exports = mongoose.model('Subscribe', Subscribe)