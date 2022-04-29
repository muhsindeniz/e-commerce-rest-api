const mongoose = require('mongoose');

var AllOrders = new mongoose.Schema({
    category: {
        type: String
    },
    data: {
        type: Number
    }
}, { collection: 'allOrders' })

module.exports = mongoose.model('AllOrders', AllOrders)