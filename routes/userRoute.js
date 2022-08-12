const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, History } = require('../models/model');
const JWT = require('jsonwebtoken');
const axios = require('axios');
const isLoggedIn = require('../helpers/validateToken');
const { json } = require('express');
const e = require('express');

JWT_SECRET = "secret"

router.post('/register', async (req, res) => {
    const { phone, name, password } = req.body;
    if (!req.body) {
        return res.status(401).json({ success: false, message: "Empty User Input" });
    }
    const isUser = await User.findOne({ phone: phone });

    if (isUser) {
        return res.status(401).json({ success: false, message: "Phone No. Already Registered" })
    }
    const hashedPassWord = await bcrypt.hash(password, 10)

    const user = new User({
        name: name,
        phone: phone,
        password: hashedPassWord
    })
    const result = await user.save()

    if (!result) {
        return res.status(401).json({ success: false, message: "Unable to register" })
    }
    else {
        return res.status(200).json({ success: true, message: "Registration Succefull" })
    }
});

router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    if (!req.body) {
        return res.status(401).json({ success: false, message: "Empty Input" });
    }
    const user = await User.findOne({ phone: phone });
    if (!user) {
        return res.status(401).json({ success: false, message: "Phone No. not registered" });
    }
    console.log(user)
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(401).json({ success: false, message: "Wrong password"})
    }
    const accessToken = JWT.sign({ phone: user.phone }, JWT_SECRET, { expiresIn: 3600 })
    return res.status(200).json({ success: true, message: "Login success", accessToken })
}
);

router.get('/getimage/:breed', isLoggedIn, async (req, res) => {
    breed = req.params.breed.toLowerCase()
    const url = `https://dog.ceo/api/breed/${breed}/images/random`
    // const response = await axios.get(url)
    // console.log(response)
    axios.get(url).then(response => {
        console.log(response)
        const createHistory = new History({
            imageUrl: response.data.message,
            phone: req.payload.phone
        })
        createHistory.save()
            .then((result) => {
                return res.status(200).json({ success: true, data: result.imageUrl })
            })
            .catch(err => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({ success: true, message: "Unable to save image" })
                }
            })
    }).catch((err) => {
        if (err) {
            return res.status(401).json({ success: true, message: "Could not find an image" })
        }
    });
})

router.get('/history/:page', isLoggedIn, async (req, res) => {
    console.log(typeof parseInt(req.params.page))
const pagenum = parseInt(req.params.page)
    if (pagenum == 1) {
        History.find({phone: req.payload.phone}).limit(10)
        .then(response => {
            return res.status(200).json({ success: true, data: JSON.stringify(response) })
        })
        .catch((err) => {
            if (err) {
                return res.status(500).json({success: false, message: "invenal server error"});
            }
        })
    }
    else{
        History.find({phone: req.payload.phone}).skip((pagenum - 1) * 10).limit(10)
        .then(response => {
            return res.status(200).json({ success: true, data: JSON.stringify(response) })
        })
        .catch((err) => {
            if (err) {
                return res.status(500).json({success: false, message: "invenal server error"});
            }
        })
    }
})


module.exports = router;