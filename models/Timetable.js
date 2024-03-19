const mongoose = require('mongoose')
const timeTableSchema = mongoose.Schema({
    courseCode : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
    },
    description :{
        type : String,
        required : true
    },
    year : {
        type : String,
        required : true
    },
    semester : {
        type : String,
        required : true
    },
    venue :{
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("TimeTable",timeTableSchema)