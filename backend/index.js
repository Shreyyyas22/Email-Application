const express = require('express');
const connectDB = require('./config/db');
const formdataRoutes = require('./routes/formdata')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(bodyParser.json())

connectDB();

app.use('api', formdataRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });