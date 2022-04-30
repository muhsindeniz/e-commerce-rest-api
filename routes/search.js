const express = require('express');
const Admin = require('../models/Admin');
const Fruits = require('../models/Fruits');
const Plants = require('../models/Plants');
const Teas = require('../models/Teas');
const Vegetables = require('../models/Vegetables');
const router = express.Router();

//Çay Listeleme
router.post('/search', async (req, res) => {

    try {
        var regex = new RegExp(req.body.text, 'i')

        let vegetables = await Vegetables.find({ name: regex })
        let fruits = await Fruits.find({ name: regex })
        let teas = await Teas.find({ name: regex })
        let plants = await Plants.find({ name: regex })

        let result = [...vegetables, ...fruits, ...teas, ...plants];

        if (result == []) {
            res.json({
                result: false,
                result_message: {
                    type: "info",
                    title: "Bilgilendirme",
                    message: "Üzgünüz ürün bulunamadı!"
                }
            })
        } else {
            res.json({
                result: result,
                result_message: {
                    type: "success",
                    title: "Bilgilendirme",
                    message: "Başarılı"
                }
            })
        }
    } catch (error) {

    }

})


module.exports = router;