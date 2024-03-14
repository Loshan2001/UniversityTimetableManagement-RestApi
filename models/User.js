const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 5, 
        max : 100
    },
    email : {
        type : String,
        required : true,
        min : 8,
        max : 355
    },
    password : {
        type : String,
        required : true,
        min : 8,
        max : 50
    },
    date : {
        type : Date,
        default : Date.now
    }
})


module.exports = mongoose.model('User',userSchema)