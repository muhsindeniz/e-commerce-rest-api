const mongoose = require('mongoose');

var Vegetables = new mongoose.Schema({
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
        default: "vegetables"
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

}, { collection: 'vegetables' })

module.exports = mongoose.model('Vegetables', Vegetables)