const express = require('express');

const app = express();
const userRoute = require('./routes/userRoute')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoute)

app.get('/test', (req, res) => {
    return res.status(200).json({
        result: 'success',
        message: "Hello from api",
        timestamp: new Date()
    })
})

app.use((err, req, res, next) =>{
    res.status(500).json({success: false, message: "something wrong happened"})
})


app.listen(4000, () => {
    console.log('app running...');
})