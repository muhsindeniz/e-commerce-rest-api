const mongoose = require('mongoose');

var SeoSetting = new mongoose.Schema({
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    youtube: {
        type: String
    },
    footerDescription: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    keywords: {
        type: String
    }
}, { collection: 'SeoSetting' })

module.exports = mongoose.model('SeoSetting', SeoSetting)