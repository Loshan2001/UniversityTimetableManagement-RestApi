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
    role : {
        type : String,
        enum: ['student', 'admin', 'staff', 'faculty'],
        required : true
    },

    //role specification 
    year : {
        type :String,
        default : null,
        required : function (){
            return this.role === 'student'
        }
    },
    semester : {
        type : String,
        default : null,
        required : function (){
            return this.role === 'student'
        }
    },
    f_Code :{
        type : String,
        default : null,
        required : function (){
            return this.role === 'faculty'
        }
    },
    totalRooms :{
        type : Number,
        default : null,
        required : function (){
            return this.role === 'faculty'
        }
    },
    date : {
        type : Date,
        default : Date.now
    }

})


module.exports = mongoose.model('User',userSchema)