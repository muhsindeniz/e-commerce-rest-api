const mongoose = require('mongoose');

var Teas = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        default: ""
    },
    discount: {
        type: String,
        default: ""
    },
    newPrice: {
        type: String,
        default: ""
    },
    productDescription: {
        type: String,
        max: 10000,
        default: ""
    },
    farmerName: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    productCategory: {
        type: String,
        default: "Teas"
    },
    calorie: {
        type: String,
        default: ""
    },
    carbohydrate: {
        type: String,
        default: ""
    },
    protein: {
        type: String,
        default: ""
    },
    oil: {
        type: String,
        default: ""
    },
    adminId: {
        type: String,
        default: ""
    },
    pastOrder: {
        type: Array
    },
    stock: {
        type: String
    }

}, { collection: 'teas' })

module.exports = mongoose.model('Teas', Teas)