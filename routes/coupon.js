const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const Coupon = require('../models/Coupon');
var mongo = require('mongodb');

//Kupon Kodu Listeleme
router.get('/coupon', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {
            const coupon = await Coupon.find();
            res.json(coupon)
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

//Kupon Kodu Ekleme
router.post('/addCoupon', async (req, res) => {
    const coupon = new Coupon({
        coupon: req.body.coupon,
        createdAt: req.body.createdAt,
        finishAt: req.body.finishAt,
        type: req.body.type
    })

    const couponCodeKontrol = await Coupon.findOne({ coupon: req.body.coupon })

    if (couponCodeKontrol) {
        res.json({
            result_message: {
                type: "error",
                title: "info",
                message: "Bu kupon kodu daha önce kullanılmış, lütfen yeni bir kupon kodu girin !!"
            }
        })
    } else {
        try {
            coupon.save()
                .then(user => {
                    res.json({
                        result_message: {
                            type: "success",
                            title: "Info",
                            message: "Kupon kodu başarıyla eklendi."
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        result_message: {
                            type: "error",
                            title: "Info",
                            message: "Kupon kodu eklenemedi."
                        }
                    })
                })

        } catch (error) {
            res.json({ message: error })
        }
    }

})

//Kupon Kodu Güncelleme
router.patch('/coupon/:id', async (req, res) => {
    try {

        await Coupon.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    coupon: req.body.coupon,
                    createdAt: req.body.createdAt,
                    finishAt: req.body.finishAt,
                    type: req.body.type
                }
            }
        )
            .then(userInfo => {
                if (userInfo) {
                    res.json({
                        result: {
                            message: "Kupon kodu bilgileri başarıyla güncellendi!"
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
                            message: "Kupon kodu bilgileri güncellenemedi!"
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
                message: "Kupon kodu bilgileri güncellenemedi!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })
    }
})

//Kupon Kodu Silme
router.delete('/coupon/:id', async (req, res) => {
    Admin.findOne({ $or: [{ token: req.headers.authorization }] }, async (error, data) => {
        if (data) {

            try {
                const removedProduct = await Coupon.remove({ _id: req.params.id });
                res.json({
                    result: {
                        message: "Kupon kodu başarıyla silindi.."
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
                        message: "Kupon kodu silinemedi.."
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

//Kupon Kodu Getirme
router.get('/coupon/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findById({ _id: req.params.id });
        res.json({
            result: coupon,
            result_message: {
                type: "success",
                title: "Bilgi",
                message: "Başarılı"
            }
        })
    } catch (error) {
        res.json({
            result: {
                message: "Kupon kodu bilgileri bulunamadı.!!"
            },
            result_message: {
                type: "error",
                title: "Bilgi",
                message: "Hata"
            }
        })

    }
})

//Kupon Kontrol
router.post('/coupon', async (req, res) => {
    const couponControl = await Coupon.findOne({ coupon: req.body.coupon });

    if (!couponControl) {
        res.json({
            result: true,
            result_message: {
                type: "info",
                title: "Bilgi",
                message: "Kupon kodu bulunamadı!"
            }
        })
    }
    else {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        let startDate = couponControl.createdAt;
        let finishAt = couponControl.finishAt;
        let type = couponControl.type;
        today = yyyy + '/' + mm + '/' + dd;

        if (today >= startDate && today <= finishAt) {

            var o_id = new mongo.ObjectID(couponControl._id);
            let removeCode = await Coupon.remove({ _id: o_id });

            if (removeCode) {
                res.json({
                    result: type,
                    result_message: {
                        type: "success",
                        title: "Bilgi",
                        message: `Tebrikler ${type} TL değerinde ki kupon kodunuz uygulandı.`
                    }
                })
            } else {
                res.json({
                    result: false,
                    result_message: {
                        type: "error",
                        title: "Bilgi",
                        message: `Üzgünüz kupon kodu kullanılamadı!`
                    }
                })
            }


        } else {
            res.json({
                result: true,
                result_message: {
                    type: "info",
                    title: "Bilgi",
                    message: "Kupon kodunun süresi geçmiş!!"
                }
            })
        }


    }
})

module.exports = router;