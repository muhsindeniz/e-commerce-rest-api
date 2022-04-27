const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const DietList = require('../models/DietList');
var mongo = require('mongodb');

//dietList Kodu Listeleme
router.get('/dietList', async (req, res) => {
    try {
        const diet = await DietList.find();
        res.json(diet)
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

//dietList Kodu Ekleme
router.post('/dietList', async (req, res) => {
    const diet = new DietList({
        content: req.body.content,
        type: req.body.type,
        drName: req.body.drName,
        email: req.body.email
    })

    try {
        diet.save()
            .then(user => {
                res.json({
                    result_message: {
                        type: "success",
                        title: "Info",
                        message: "Liste başarıyla eklendi."
                    }
                })
            })
            .catch(error => {
                res.json({
                    result_message: {
                        type: "error",
                        title: "Info",
                        message: "Liste eklenemedi."
                    }
                })
            })

    } catch (error) {
        res.json({ message: error })
    }

})

//dietList Güncelleme
router.patch('/dietList/:id', async (req, res) => {
    try {

        await DietList.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    content: req.body.content,
                    type: req.body.type,
                    drName: req.body.drName,
                    email: req.body.email
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Diet listesi bilgileri başarıyla güncellendi!"
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
                            message: "Diet listesi bilgileri güncellenemedi!"
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
                message: "Diet listesi bilgileri güncellenemedi!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })
    }
})

//dietList Silme
router.delete('/dietList/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                const removedProduct = await DietList.remove({ _id: req.params.id });
                res.json({
                    result: {
                        message: "Diet listesi başarıyla silindi.."
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
                        message: "Diet listesi silinemedi.."
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

router.get('/dietList/:id', async (req, res) => {
    try {
        const diet = await DietList.findById({ _id: req.params.id });
        res.json({
            result: diet,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })

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

module.exports = router;