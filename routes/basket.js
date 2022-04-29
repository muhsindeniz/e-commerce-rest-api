const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');
var mongo = require('mongodb');

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
            }).catch(err => {
                res.json({
                    result: null,
                    result_message: {
                        type: "error",
                        title: "Bilgi",
                        message: "Ürün sepete eklenemedi!"
                    }
                })
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

//Sepeti silme
router.delete('/basket/:id', async (req, res) => {
    const couponControl = await Basket.findOne({ userId: req.params.id });
    if (couponControl) {
        var o_id = new mongo.ObjectID(couponControl._id);
        let removeCode = await Basket.remove({ _id: o_id });

        if (removeCode) {
            res.json({
                result: true,
                result_message: {
                    type: "success",
                    title: "Bilgi",
                    message: `Siparişiniz başarıyla verildi.`
                }
            })
        } else {
            res.json({
                result: false,
                result_message: {
                    type: "error",
                    title: "Bilgi",
                    message: `Üzgünüz siparişiniz verilemedi!`
                }
            })
        }

    } else {
        res.json({
            result: false,
            result_message: {
                type: "error",
                title: "Bilgi",
                message: `Üzgünüz siparişiniz verilemedi!`
            }
        })
    }

})


module.exports = router;