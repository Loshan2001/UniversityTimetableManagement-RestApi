const express = require('express')
const router = express.Router()
const verify = require('../middleware/verifyToken')
const Room = require('../models/Room')
const {roomReservationValidation} = require("../Validation/roomValidation")

router.post('/reserve',verify,async(req,res)=>{
      //first validate faculty
    if(req.user.role !== 'faculty') return res.status(401).json({ message: 'Forbidden. Only Faculty can reserve rooms.'})
    

    // Validate the request data
    const { error } = roomReservationValidation(req.body);
    if (error)  return res.status(400).json({ message: error.details[0].message });

     //checking if RoomID already in the database 
      const RoomID = await Room.findOne( {roomCode : req.body.roomCode})
      if (RoomID) return res.status(400).send('Room already exists')
  
       // Check if any room is already booked at the specified time
       const startTime = req.body.bookings[0].startTime;
       const endTime = req.body.bookings[0].endTime;
       const date = req.body.bookings[0].date;
   
       const existingBooking = await Room.findOne({
           'bookings.date': date,
           $or: [
               {
                   $and: [
                       { 'bookings.startTime': { $lt: endTime } },
                       { 'bookings.endTime': { $gt: startTime } }
                   ]
               },
               {
                   $and: [
                       { 'bookings.startTime': { $eq: startTime } },
                       { 'bookings.endTime': { $eq: endTime } }
                   ]
               }
           ]
       });
   
       // If any room is already booked at the specified time, return an error
       if (existingBooking) {
           return res.status(400).json({ message: 'One or more rooms are already booked at the specified time.' });
       }
   

    const room = new Room({
      roomCode: req.body.roomCode,
            capacity: req.body.capacity,
            features: req.body.features,
          //   availability: req.body.availability.map(avail => ({
          //     dayOfWeek: avail.dayOfWeek,
          //     startTime: avail.startTime,
          //     endTime: avail.endTime
          // })),
            bookings: req.body.bookings.map(booking => ({
              date: booking.date, // Ensure date is provided for each booking
              startTime: booking.startTime,
              endTime: booking.endTime,
              purpose: booking.purpose,
              faculty: req.user.id // Assign faculty ID
          }))

    })

    try{
      const savedRoom = await room.save();
      res.status(201).json(savedRoom);
    }
    catch(err){
      console.log(err)
      res.status(500).json({ message:"Internal server error"});
    }
})


module.exports = router