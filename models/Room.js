const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomCode : {
        type : String,
        unique : true,
        required : true
    },
    capacity: {
         type: Number, 
        required: true 
    },
    
    features: [String], // Array of strings for features/equipment

    // availability: [{
    //     dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    //     startTime: String,
    //     endTime: String
    // }],
    bookings: [{
        date: { 
            type: Date, required: true
              },
        startTime: String,
        endTime: String,
        purpose: String,
        faculty: {
             type: mongoose.Schema.Types.ObjectId, ref: 'User' 
            } 
    }]
    
})

module.exports = mongoose.model('Room',roomSchema)