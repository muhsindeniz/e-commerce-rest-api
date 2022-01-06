const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken');

// const schema = {
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//     gender: Joi.string().min(3).required()
// }

//Kullanıcı Kaydı

router.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {

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

        try {
            if(req.file){
                user.avatar = req.file.path
            }
            user.save()
                .then(user => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Bilgi",
                            message: "Kayıt başarıyla yapıldı."
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Bilgi",
                            message: "Kayıt başarısız."
                        }
                    })
                })
        } catch (error) {
            res.json({ message: error })
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
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ user }, 'verySecretValue', { expiresIn: '1h' })
                        res.json({
                            result: {
                                token,
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                roles: user.roles,
                                createdAt: user.createdAt,
                                birthday: user.birthday,
                                gender: user.gender,
                                avatar: user.avatar
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


//Kullanıcı Listeleme

router.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router;