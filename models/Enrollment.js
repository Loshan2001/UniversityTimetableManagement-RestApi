 
const mongoose = require('mongoose')
const enrollmentSchema = mongoose.Schema({
    student:{
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }, 
    studentName:{
        type : String,
        
    },
    courseCode : {
        type : String,
        required : true,
    },
    year : {
        type : String,
        
    },
    semester : {
        type : String,
        
    }
  
})

module.exports = mongoose.model("Enrollment",enrollmentSchema)