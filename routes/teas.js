const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const Teas = require('../models/Teas');

//Çay Listeleme
router.get('/teas', async (req, res) => {
    try {
        const vegetables = await Teas.find();
        res.json(vegetables)
    } catch (error) {
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

//Çay Ekleme
router.post('/addTeas', (req, res) => {
    const vegetables = new Teas({
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        newPrice: req.body.newPrice,
        productDescription: req.body.productDescription,
        farmerName: req.body.farmerName,
        avatar: req.body.avatar,
        calorie: req.body.calorie,
        carbohydrate: req.body.carbohydrate,
        protein: req.body.protein,
        oil: req.body.oil,
        adminId: req.body.adminId,
        stock: req.body.stock
    })

    try {
        if (req.file) {
            vegetables.avatar = req.file.path
        }

        vegetables.save()
            .then(user => {
                res.json({
                    result_message: {
                        type: "success",
                        title: "Info",
                        message: "The Tea has been successfully added."
                    }
                })
            })
            .catch(error => {
                res.json({
                    result_message: {
                        type: "error",
                        title: "Info",
                        message: "The Tea could not be added"
                    }
                })
            })

    } catch (error) {
        res.json({ message: error })
    }

})

//Çay Güncelleme
router.patch('/teas/:id', async (req, res) => {
    try {

        if (req.file) {
            req.body.avatar = req.file.path
        }

        await Teas.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    discount: req.body.discount,
                    newPrice: req.body.newPrice,
                    productDescription: req.body.productDescription,
                    farmerName: req.body.farmerName,
                    avatar: req.body.avatar,
                    calorie: req.body.calorie,
                    carbohydrate: req.body.carbohydrate,
                    protein: req.body.protein,
                    oil: req.body.oil,
                    adminId: req.body.adminId,
                    stock: req.body.stock
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Ürün bilgileri başarıyla güncellendi!"
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

//Çay Silme
router.delete('/teas/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {

            try {
                const removedProduct = await Teas.remove({ _id: req.params.id });
                res.json({
                    result: {
                        message: "Ürün başarıyla silindi.."
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
                        message: "Ürün silinemedi.."
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

//Çay Getirme
router.get('/teas/:id', async (req, res) => {
    try {
        const vegetables = await Teas.findById({ _id: req.params.id });
        res.json({
            result: vegetables,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })
    } catch (error) {
        res.json({
            result: {
                message: "Çay bilgileri bulunamadı.!!"
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