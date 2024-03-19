const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomCode : {
        type : String,
        required : true
    },
    f_Code : {
        type : mongoose.Schema.ObjectId,
        required : true
    },
    capacity : {
        type : Number,
        required : true
    },
    projector : {
        type : Number,
        default : 1,
        required : true
    }

    
})

module.exports = mongoose.model('Room',roomSchema)