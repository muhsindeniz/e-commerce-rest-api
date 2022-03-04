const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

//Admin Kaydı
router.post('/adminRegister', (req, res) => {
    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {

        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })

        const adminControl = await Admin.findOne({ email: req.body.email })
        if (adminControl) {
            res.json({
                result_message: {
                    type: "error",
                    title: "info",
                    message: "This e-mail address has been used before"
                }
            })
        } else {
            try {
                admin.save()
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
})

//Admin Girişi
router.post('/adminLogin', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    Admin.findOne({ $or: [{ email: email }, { password: password }] })
        .then(admin => {
            if (admin) {
                bcrypt.compare(password, admin.password, async function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({
                            result: {
                                _id: admin._id,
                                name: admin.name,
                                email: admin.email,
                                roles: admin.roles,
                                createdAt: admin.createdAt,
                                isLogin: true
                            }
                        }, 'verySecretValue', { expiresIn: '1h' })

                        await Admin.updateOne({
                            token: admin.token
                        }, {
                            $set: {
                                token: token
                            }
                        })

                        res.json({
                            result: {
                                token,
                                _id: admin._id,
                                name: admin.name,
                                email: admin.email,
                                roles: admin.roles,
                                createdAt: admin.createdAt,
                                isLogin: true
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
                                message: "Password does not matched!"
                            },
                            result_message: {
                                type: "info",
                                title: "Bilgi",
                                message: "Başarısız"
                            }
                        })
                    }
                })
            } else {
                res.json({
                    result: {
                        message: "No user found!"
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

//Admin Silme
router.delete('/admin/:id', async (req, res) => {
    try {
        const removedAdmin = await Admin.remove({ _id: req.params.id });
        res.json({
            result: {
                message: "Admin successfully deleted.."
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
                message: "Admin could not be deleted.."
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })

    }
})

//Admin Güncelleme
router.patch('/admin/:id', async (req, res) => {
    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {
        try {
            await Admin.updateOne(
                {
                    _id: req.params.id
                },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPass
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

//Admin Bilgileri Getirme
router.post('/admin/:id', async (req, res) => {

    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            try {
                const admin = await Admin.findById({ _id: req.params.id });
                res.json({
                    result: admin,
                    result_message: {
                        type: "success",
                        title: "Info",
                        message: "Success"
                    }
                })
            } catch (error) {
                res.json({
                    result: {
                        message: "Admin not found.."
                    },
                    result_message: {
                        type: "error",
                        title: "Info",
                        message: "Error"
                    }
                })

            }
        } else {
            res.json({
                result: null,
                result_message: {
                    type: "token_refresh",
                    title: "Information",
                    message: "Bilgileriniz güncellenmiştir."
                }
            })
        }
    })


})

//Admin şifre değiştirme
router.post('/adminUpdatePassword', async (req, res) => {
    var password = req.body.password;
    var newPassword = req.body.newPassword;

    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, (error, data) => {
        if (data) {
            bcrypt.compare(password, data.password, function (err, result) {
                if (result) {
                    bcrypt.hash(newPassword, 10, async function (err, hashedPass) {
                        await Admin.updateOne({ token: req.headers.authorization },
                            {
                                $set: {
                                    password: hashedPass,
                                }
                            })
                            .then(adminInfo => {
                                if (adminInfo) {
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


module.exports = router;