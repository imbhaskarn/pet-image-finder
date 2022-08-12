const mongoose = require('mongoose');

const {Schema} = mongoose;

mongoose.connect('mongodb://172.17.0.2:27017/', (err) => {
    if (!err) {
        console.log("connected to db");
    }
})

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const userHistory = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("User",userSchema, 'users');
const History = mongoose.model('History', userHistory, 'history');

module.exports= {
    User, History
}
