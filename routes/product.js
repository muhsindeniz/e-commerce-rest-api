const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const Product = require('../models/Product');

//Ürün Listeleme
router.get('/product', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            const product = await Product.find();
            res.json(product)
        } else {
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

//Ürün Ekleme
router.post('/addProduct', (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, (error, data) => {
        if (data) {

            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                discount: req.body.discount,
                newPrice: req.body.newPrice,
                productDescription: req.body.productDescription,
                farmerName: req.body.farmerName,
                avatar: req.body.avatar,
                productCategory: req.body.productCategory,
                calorie: req.body.calorie,
                carbohydrate: req.body.carbohydrate,
                protein: req.body.protein,
                oil: req.body.oil,
                adminId: req.body.adminId
            })

            try {
                if (req.file) {
                    product.avatar = req.file.path
                }

                product.save()
                    .then(user => {
                        res.json({
                            result_message: {
                                type: "success",
                                title: "Info",
                                message: "The product has been successfully added."
                            }
                        })
                    })
                    .catch(error => {
                        res.json({
                            result_message: {
                                type: "error",
                                title: "Info",
                                message: "The product could not be added"
                            }
                        })
                    })

            } catch (error) {
                res.json({ message: error })
            }
        } else {
            res.json({
                result: null,
                result_message: {
                    type: "token_refresh",
                    title: "Bilgilendirme",
                    message: "Your Token Information has been updated."
                }
            })
        }
    })
})

//Ürün Silme
router.delete('/product/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {

            try {
                const removedProduct = await Product.remove({ _id: req.params.id });
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

module.exports = router;