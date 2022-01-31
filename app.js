const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = require('./middleware/upload')
const auth = require('./routes/auth');
const user = require('./routes/user');
const admin = require('./routes/admin');
require('dotenv/config')

app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static('uploads'))
app.use('/api', upload.single('avatar') ,auth, user);
app.use('/api', admin)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to mongoDB")
})

app.get('/', (req, res) => {
    res.send("Wolcome!!")
})

app.listen(3000) 
