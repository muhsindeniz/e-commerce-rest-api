const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');

// const schema = {
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//     gender: Joi.string().min(3).required()
// }

//Kullanıcı Kaydı

router.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {

        // const { error } = Joi.validate(req.body, schema)

        // if (error) {
        //     return res.status(400).json({
        //         message: error.details[0].message
        //     })
        // }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            gender: req.body.gender,
            birthdayString: req.body.birthdayString,
            avatar: req.body.avatar
        })

        const userControl = await User.findOne({ email: req.body.email })
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
})



//Kullanıcı Girişi

router.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ $or: [{ email: email }, { password: password }] })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, async function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({
                            result: {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                roles: user.roles,
                                createdAt: user.createdAt,
                                birthdayString: user.birthdayString,
                                gender: user.gender,
                                avatar: user.avatar,
                                isLogin: true
                            }
                        }, 'verySecretValue', { expiresIn: '1h' })

                        await User.updateOne({
                            token: user.token
                        }, {
                            $set: {
                                token: token
                            }
                        })

                        res.json({
                            result: {
                                token,
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                roles: user.roles,
                                createdAt: user.createdAt,
                                birthdayString: user.birthdayString,
                                gender: user.gender,
                                avatar: user.avatar,
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

module.exports = router;