const express = require('express');
const router = express.Router();
const Subscribe = require('../models/Subscribe');
var mongo = require('mongodb');

//Abone Listeleme
router.get('/subscribe', async (req, res) => {
    try {
        const subscribe = await Subscribe.find();
        res.json(subscribe)
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

//Abone Ekleme
router.post('/addSubscribe', async (req, res) => {
    const subscribe = new Subscribe({
        userId: req.body.userId,
        email: req.body.email,
    })

    let control = await Subscribe.findOne({ userId: req.body.userId })

    if (control) {
        res.json({
            result: false,
            result_message: {
                type: "error",
                title: "Info",
                message: "You already have a registered subscription, please contact to change"
            }
        })
    } else {
        try {
            subscribe.save()
                .then(user => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Info",
                            message: "successfully added."
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        result_message: {
                            type: "error",
                            title: "Info",
                            message: "Not be added"
                        }
                    })
                })

        } catch (error) {
            res.json({ message: error })
        }
    }

})

//Abone Güncelleme
router.patch('/subscribe/:id', async (req, res) => {
    try {
        await Subscribe.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    userId: req.body.userId,
                    subscribe: req.body.subscribe,
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Abone başarıyla güncellendi!"
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
                            message: "Abone bilgileri güncellenemedi!"
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
                message: "Abone bilgileri güncellenemedi!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })
    }
})

//Abone Silme
router.delete('/subscribe/:id', async (req, res) => {
    Subscribe.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {

            try {
                const removedProduct = await Subscribe.remove({ _id: req.params.id });
                res.json({
                    result: {
                        message: "Abone başarıyla silindi.."
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
                        message: "Abone silinemedi.."
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

//Abone Getirme
router.get('/subscribe/:id', async (req, res) => {
    try {
        const subscribe = await Subscribe.findById({ _id: req.params.id });
        res.json({
            result: subscribe,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })
    } catch (error) {
        res.json({
            result: {
                message: "Abone bilgileri bulunamadı.!!"
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