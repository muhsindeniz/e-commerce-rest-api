const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken');


//Kullanıcı Listeleme

router.get('/user', async (req, res) => {

    // console.log(req.headers.authorization)
    User.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if(data){
            const users = await User.find();
            res.json(users)
        }else{
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

//Kullanıcı Silme
router.delete('/user/:id', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.id });
        res.json({
            result: {
                message: "Kullanıcı başarıyla silindi.."
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
                message: "Kullanıcı silinemedi.."
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })

    }
})

//Kullanıcı Güncelleme

router.patch('/user/:id', async (req, res) => {
    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {
        try {
            await User.updateOne(
                {
                    _id: req.params.id
                },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPass,
                        gender: req.body.gender,
                        birthdayString: req.body.birthdayString,
                        avatar: req.body.avatar
                    }
                }
            )
                .then(userInfo => {
                    if (userInfo) {
                        res.json({
                            result: {
                                message: "Kullanıcı bilgileri başarıyla güncellendi!"
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
                                message: "Kullanıcı bilgileri güncellenemedi!"
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
                    message: "Kullanıcı bilgileri güncellenemedi!"
                },
                result_message: {
                    type: "error",
                    title: "Bilgi",
                    message: "Hata"
                }
            })
        }
    })
})

//Kullanıcı Bilgileri Getirme

router.post('/user/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        res.json({
            result: user,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })
    } catch (error) {
        res.json({
            result: {
                message: "Kullanıcı silinemedi.."
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