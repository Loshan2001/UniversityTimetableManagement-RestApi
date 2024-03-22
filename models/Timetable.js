const mongoose = require('mongoose')
const timeTableSchema = mongoose.Schema({
    courseCode : {
        type : String,
        required : true,
    },
    roomCode :{
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
    description: [{
        date: { 
            type: Date, required: true
              },
        startTime: String,
        endTime: String,
        purpose: String,
        facultyCode: {
             type: String 
            } 
        
    }],
    staff : {
        type : String,
        ref: 'User'
    }
}) // Prevent Mongoose from auto-generating _id for description subdocuments

module.exports = mongoose.model("TimeTable",timeTableSchema)