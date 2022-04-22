const mongoose = require('mongoose');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '/' + mm + '/' + dd;

var Orders = new mongoose.Schema({
    userId: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: today
    },
    basket: {
        type: Array,
    },
    address: {
        type: Array
    },
    orderStatus: {
        type: String,
        default: 'Waiting for approval'
    },
    estimatedArrivalDate: {
        type: String
    },
    discountCodeAmount: {
        type: String,
        default: 0
    },
    totalPricePaid: {
        type: String
    }
}, { collection: 'orders' })

module.exports = mongoose.model('Orders', Orders)