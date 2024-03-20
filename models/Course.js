const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseCode : {
        type : String,
        unique : true,
        required : true
    },
    courseName : {
        type : String,
        required : true 
    },
    description : {
        type : String,
        required : true
    },
    credits : {
        type : Number,
        required : true
    },
    faculty : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    facultyCode :{
        type : String,
        enum : ['CS' , 'BS' , 'EN'],
        required : true
    },
    staff :{
        type: mongoose.Schema.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model('Course',courseSchema)