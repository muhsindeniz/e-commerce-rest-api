const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv/config')
const upload = require('./middleware/upload')
const auth = require('./routes/auth');

app.use('/api',upload.single('avatar') ,auth);
app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to mongoDB")
})

app.get('/', (req, res) => {
    res.send("Wolcome!!")
})

app.listen(3000) 
