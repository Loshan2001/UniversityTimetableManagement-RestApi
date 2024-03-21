const express = require('express')
const router = express.Router()
const verify = require('../middleware/verifyToken')
const Room = require('../models/Room')
const TimeTable = require('../models/Timetable')
const {roomReservationValidation} = require("../Validation/roomValidation")
const Notification = require('../models/Notification')
router.post('/reserve', verify, async (req, res) => {
    // First validate faculty
    if (req.user.role !== 'faculty') return res.status(401).json({ message: 'Forbidden. Only Faculty can reserve rooms.' });

    // Validate the request data
    const { error } = roomReservationValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Extract the booking details
    const booking = req.body.bookings[0];
    const startTime = booking.startTime;
    const endTime = booking.endTime;
    const date = booking.date;

    try {
        // Check if any room is already booked at the specified time
        const existingBookings = await Room.find({
            roomCode: req.body.roomCode,
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
        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'One or more rooms are already booked at the specified time.' });
        }

         // Check if any room is available or not at the specified time
     const roomAvailble = await TimeTable.find({
        roomCode:req.body.roomCode,
        'description.date': date,
        $or: [
            {
                $and: [
                    { 'description.startTime': { $lt: endTime } },
                    { 'description.endTime': { $gt: startTime } }
                ]
            },
            {
                $and: [
                    { 'description.startTime': { $eq: startTime } },
                    { 'description.endTime': { $eq: endTime } }
                ]
            }
        ]
    });
  // If any room is already booked at the specified time, return an error
    if (roomAvailble.length > 0) {
        return res.status(400).json({ message: 'One or more rooms are already reserved for events at the specified time.' });
    }






        // No rooms are booked at the specified time, proceed to reserve the room
        const room = new Room({
            roomCode: req.body.roomCode,
            capacity: req.body.capacity,
            features: req.body.features,
            bookings: [{
                date: booking.date,
                startTime: startTime,
                endTime: endTime,
                purpose: booking.purpose,
                faculty: req.user.id
            }]
        });

        const savedRoom = await room.save();
        
        //sent notification
        const message = `${req.user.f_Code} student have a ${booking.purpose} on ${ booking.date} at ${startTime} in ${req.body.roomCode}`
        const notification = new Notification({
            recipient : req.user.id,
            sender : req.user.email,
            message : message


        })
        
        await notification.save()
        res.status(201).json({savedRoom , message : `notification sent ${req.user.f_Code} faculty students`});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

 


router.delete('/unreserve/:roomId', verify, async (req, res) => {
    // First validate faculty
    if (req.user.role !== 'faculty')
        return res.status(401).json({ message: `Forbidden. Only specific Faculty can unreserve rooms.` });

    try {
        // Find the room by its ID
        const room = await Room.findById(req.params.roomId);

        // If room not found, return error
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the faculty user has the permission to unreserve this room
        // For example, you may want to ensure that the user who reserved the room is the one unreserving it
        if (room.bookings[0].faculty.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to unreserve this room' });
        }

        //sent notification
        const message = `${req.user.f_Code} cancel the ${room.bookings[0].purpose} on ${ room.bookings[0].date} at ${room.bookings[0].startTime} in ${room.roomCode}`
        const notification = new Notification({
            recipient : req.user.id,
            sender : req.user.email,
            message : message


        })
        
        await notification.save()
        // Remove the room booking
        await Room.findByIdAndDelete(req.params.roomId);

        res.status(200).json({ message: `Room unreserved successfully and notification sent ${req.user.f_Code} faculty students` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router