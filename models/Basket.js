const mongoose = require('mongoose');

var Basket = new mongoose.Schema({
    products: {
        type: Array
    },
    userId: {
        type: String
    }
}, { collection: 'basket' })

module.exports = mongoose.model('Basket', Basket)