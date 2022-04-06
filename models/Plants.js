const mongoose = require('mongoose');

var Plants = new mongoose.Schema({
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
        default: "Fruit"
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
    }

}, { collection: 'plants' })

module.exports = mongoose.model('Plants', Plants)