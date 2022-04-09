const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');

//Sepete ekleme
router.post('/basket', async (req, res) => {

    const basket = new Basket({
        userId: req.body.userId,
        products: req.body.products
    })

    let basketControl = await Basket.findOne({ userId: req.body.userId });

    if (!basketControl) {
        basket.save()
            .then(adres => {
                res.json({
                    result_message: {
                        type: "success",
                        title: "Info",
                        message: "Ürün Sepete eklendi."
                    }
                })
            })
            .catch(error => {
                res.json({
                    result_message: {
                        type: "error",
                        title: "Info",
                        message: "Ürün sepete eklenemedi!"
                    }
                })
            })
    } else {
        Basket.updateOne({ userId: req.body.userId },
            {
                $set: {
                    products: req.body.products
                }
            })
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Ürün sepete eklendi.."
                        },
                        result_message: {
                            type: "success",
                            title: "Bilgi",
                            message: "Başarılı"
                        }
                    })

                } else {
                    res.json({
                        result: null,
                        result_message: {
                            type: "error",
                            title: "Bilgi",
                            message: "Ürün sepete eklenemedi!"
                        }
                    })
                }
            })
    }
})

//Sepete güncelleme
router.get('/basket/:id', async (req, res) => {
    try {
        const basket = await Basket.findOne({ userId: req.params.id });
        res.json(basket)
    } catch (error) {
        res.json({
            result: null,
            result_message: {
                type: "error",
                title: "Bilgilendirme",
                message: "Sepet Boş"
            }
        })
    }
})


module.exports = router;