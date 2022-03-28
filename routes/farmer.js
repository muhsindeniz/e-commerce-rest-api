const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer')
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

//Çifçi Listeleme
router.get('/farmer', async (req, res) => {

    // console.log(req.headers.authorization)
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            const users = await Farmer.find();
            res.json(users)
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

//Çifçi Bilgileri getirme
router.get('/farmer/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                const userInfo = await Farmer.findById({ _id: req.params.id });
                if (userInfo) {
                    res.json({
                        result: userInfo,
                        result_message: {
                            type: "success",
                            title: "info",
                            message: "Information successfully retrieved"
                        }
                    })
                } else {
                    res.json({
                        result: null,
                        result_message: {
                            type: "error",
                            title: "info",
                            message: "Could not get information!!"
                        }
                    })
                }
            } catch (error) {
                res.json({
                    result: null,
                    result_message: {
                        type: "error",
                        title: "info",
                        message: "Could not get information!!"
                    }
                })
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

//Çifçi Silme
router.delete('/farmer/:id', async (req, res) => {
    try {
        const removedUser = await Farmer.remove({ _id: req.params.id });
        res.json({
            result: {
                message: "Çifçi başarıyla silindi.."
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
                message: "Çifçi silinemedi.."
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })

    }
})

//Çifçi Güncelleme
router.patch('/farmer/:id', async (req, res) => {
    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {
        try {
            await Farmer.updateOne(
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
                                message: "Çifçi bilgileri başarıyla güncellendi!"
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
                                message: "Çifçi bilgileri güncellenemedi!"
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
                    message: "Çifçi bilgileri güncellenemedi!"
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

// //Çifçi Bilgileri Getirme
// router.post('/farmer/:id', async (req, res) => {
//     try {
//         const user = await Farmer.findById({ _id: req.params.id });
//         res.json({
//             result: user,
//             result_message: {
//                 type: "success",
//                 title: "Bilgi",
//                 message: "Başarılı"
//             }
//         })
//     } catch (error) {
//         res.json({
//             result: {
//                 message: "Çifçi silinemedi.."
//             },
//             result_message: {
//                 type: "error",
//                 title: "Bilgi",
//                 message: "Hata"
//             }
//         })

//     }
// })

//Çifçi Kaydı
router.post('/farmer', async (req, res) => {
    const user = new Farmer({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        avatar: req.body.avatar,
        description: req.body.description
    })

    const userControl = await Farmer.findOne({ email: req.body.email })
    if (userControl) {
        res.json({
            result_message: {
                type: "error",
                title: "info",
                message: "This e-mail address has been used before"
            }
        })
    } else {
        try {
            if (req.file) {
                user.avatar = req.file.path
            }

            user.save()
                .then(user => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Info",
                            message: "Registration done successfully."
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        result_message: {
                            type: "error",
                            title: "Info",
                            message: "Registration failed."
                        }
                    })
                })

        } catch (error) {
            res.json({ message: error })
        }
    }

})

module.exports = router;