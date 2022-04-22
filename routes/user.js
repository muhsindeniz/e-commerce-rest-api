const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Address = require('../models/Address');
const Admin = require('../models/Admin');

//Kullanıcı Listeleme
router.get('/user', async (req, res) => {

    // console.log(req.headers.authorization)
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            const users = await User.find();
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

//Kullanıcı Bilgileri getirme
router.get('/user/:id', async (req, res) => {
    try {
        const userInfo = await User.findById({ _id: req.params.id });
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
                        avatar: req.body.avatar,
                        pastOrders: req.body.pastOrders
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

//Kullanıcı Sipariş Ekleme
router.post('/order/:id', async (req, res) => {



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

//Kullanıcı şifre değiştirme
router.post('/updatePassword', async (req, res) => {
    var password = req.body.password;
    var newPassword = req.body.newPassword;

    User.findOne({ $or: [{ token: req.headers.authorization }] }, (error, data) => {
        if (data) {
            bcrypt.compare(password, data.password, function (err, result) {
                if (result) {
                    bcrypt.hash(newPassword, 10, async function (err, hashedPass) {
                        await User.updateOne({ token: req.headers.authorization },
                            {
                                $set: {
                                    password: hashedPass,
                                }
                            })
                            .then(userInfo => {
                                if (userInfo) {
                                    res.json({
                                        result: {
                                            message: "User password updated successfully!"
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
                                            message: "Could not update user password!"
                                        }
                                    })
                                }
                            })
                    })
                } else {
                    res.json({
                        result: null,
                        result_message: {
                            type: "error",
                            title: "Bilgi",
                            message: "Your current password is not correct, please check!!"
                        }
                    })
                }
            })
        } else {
            res.json({
                result: null,
                result_message: {
                    type: "error",
                    title: "Bilgilendirme",
                    message: "Could not update user password!"
                }
            })
        }
    })
})

//Kullanıcı Teslimat Adresi ekleme
router.post('/address', async (req, res) => {
    const address = new Address({
        id: req.body.id,
        name: req.body.name,
        province: req.body.province,
        district: req.body.district,
        address: req.body.address,
        addressTitle: req.body.addressTitle,
        phone: req.body.phone,
        pastOrders: req.body.pastOrders
    })

    const adresControl = await Address.findOne({ id: req.body.id })
    if (adresControl) {
        res.json({
            result_message: {
                type: "error",
                title: "info",
                message: "You currently have an active address!!"
            }
        })
    } else {
        try {
            address.save()
                .then(adres => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Info",
                            message: "Address successfully added.."
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        result_message: {
                            type: "error",
                            title: "Info",
                            message: "Address could not be added!!."
                        }
                    })
                })

        } catch (error) {
            res.json({ message: error })
        }
    }
})

//Kullanıcı Teslimat Adresi Listeleme
router.get('/address/:id', async (req, res) => {
    User.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                let userAddress = await Address.findOne({ id: req.params.id });
                if (userAddress) {
                    res.json({
                        result: userAddress,
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
                            message: "Address not found"
                        }
                    })
                }
            } catch (error) {
                res.json({
                    result: null,
                    result_message: {
                        type: "error",
                        title: "Bilgi",
                        message: "Address not found"
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

//Kullanıcı Teslimat Adresi Silme
router.delete('/address/:id', async (req, res) => {
    User.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                let userAddress = await Address.remove({ id: req.params.id });
                if (userAddress) {
                    res.json({
                        result: userAddress,
                        result_message: {
                            type: "success",
                            title: "info",
                            message: "Address deleted successfully"
                        }
                    })
                } else {
                    res.json({
                        result: null,
                        result_message: {
                            type: "error",
                            title: "info",
                            message: "Address could not be deleted"
                        }
                    })
                }
            } catch (error) {
                res.json({
                    result: null,
                    result_message: {
                        type: "error",
                        title: "info",
                        message: "Address could not be deleted"
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

module.exports = router;