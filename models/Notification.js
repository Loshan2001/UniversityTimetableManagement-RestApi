
const mongoose = require('mongoose')
const notificationSchema = mongoose.Schema({
    recipient : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
    },
    sender : {
        type : String,
        required : true
    },
    message :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model("Notification",notificationSchema)