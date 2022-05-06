const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const SeoSetting = require('../models/SeoSetting');
var mongo = require('mongodb');

//Kupon Kodu Listeleme
router.get('/seoSetting', async (req, res) => {
    try {
        const seo = await SeoSetting.find();
        res.json(seo)
    } catch (error) {

    }
})

//Kupon Kodu Güncelleme
router.patch('/seoSetting', async (req, res) => {
    try {
        await SeoSetting.updateOne({
                $set: {
                    twitter: req.body.twitter,
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    youtube: req.body.youtube,
                    footerDescription: req.body.footerDescription,
                    title: req.body.title,
                    keywords: req.body.keywords,
                    description: req.body.description,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Bilgiler başarıyla güncellendi!"
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
                            message: "Bilgiler güncellenemedi!"
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
                message: "Bilgiler güncellenemedi!"
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