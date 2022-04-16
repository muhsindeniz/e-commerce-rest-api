const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const Orders = require('../models/Orders');

//Sipariş Listeleme
router.get('/orders', async (req, res) => {
    try {
        const orders = await Orders.find();
        res.json(orders)
    } catch (error) {
        res.json({
            result: null,
            result_message: {
                type: "error",
                title: "Bilgilendirme",
                message: "Veriler yok."
            }
        })
    }
})

//Sipariş Ekleme
router.post('/addOrders', (req, res) => {
    const orders = new Orders({
        userId: req.body.userId,
        createdAt: req.body.createdAt,
        basket: req.body.basket,
        address: req.body.address,
        orderStatus: req.body.orderStatus,
        estimatedArrivalDate: req.body.estimatedArrivalDate
    })

    try {
        orders.save()
            .then(user => {
                res.json({
                    result_message: {
                        type: "success",
                        title: "Info",
                        message: "The product has been successfully ordered."
                    }
                })
            })
            .catch(error => {
                res.json({
                    result_message: {
                        type: "error",
                        title: "Info",
                        message: "The order could not be fulfilled!"
                    }
                })
            })

    } catch (error) {
        res.json({ message: error })
    }

})

//Sipariş Güncelleme
router.patch('/orders/:id', async (req, res) => {
    try {
        await Orders.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    userId: req.body.userId,
                    createdAt: req.body.createdAt,
                    basket: req.body.basket,
                    address: req.body.address,
                    orderStatus: req.body.orderStatus,
                    estimatedArrivalDate: req.body.estimatedArrivalDate
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Siparişler başarıyla güncellendi!"
                        },
                        result_message: {
                            type: "success",
                            title: "Bilgi",
                            message: "Başarılı"
                        }
                    })

                } else {
                    res.json({
                        result: {
                            message: "Ürün bilgileri güncellenemedi!"
                        },
                        result_message: {
                            type: "error",
                            title: "Bilgi",
                            message: "Hata"
                        }
                    })
                }
            })


    } catch (err) {
        res.json({
            result: {
                message: "Ürün bilgileri güncellenemedi!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })
    }
})

//Sipariş Silme
router.delete('/orders/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                const removedProduct = await Orders.remove({ _id: req.params.id });
                res.json({
                    result: {
                        message: "Sipariş başarıyla silindi.."
                    },
                    result_message: {
                        type: "success",
                        title: "Bilgi",
                        message: "Başarılı"
                    }
                })
            } catch (error) {
                res.json({
                    result: {
                        message: "Sipariş silinemedi.."
                    },
                    result_message: {
                        type: "error",
                        title: "Bilgi",
                        message: "Hata"
                    }
                })
            }
        }
        else {
            res.json({
                result: null,
                result_message: {
                    type: "token_refresh",
                    title: "Bilgilendirme",
                    message: "Bilgileriniz güncellenmiştir."
                }
            })
        }
    })

})

//Sipariş Getirme
router.get('/orders/:id', async (req, res) => {
    try {
        const orders = await Orders.findById({ _id: req.params.id });
        res.json({
            result: orders,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })
    } catch (error) {
        res.json({
            result: {
                message: "Sipariş bilgileri bulunamadı.!!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })

    }
})


module.exports = router;