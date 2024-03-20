const express = require('express')
const router = express.Router() 
const mongoose = require('mongoose')
const TimeTable = require('../models/Timetable')
const verify = require('../middleware/verifyToken')
const Course = require('../models/Course')
const User = require('../models/User')
const Room = require('../models/Room')
const {timetableValidation} = require('../Validation/timetableValidation')

router.post('/addTimetable',verify,async(req,res)=>{
     // First validate faculty
     if (req.user.role !== 'faculty') return res.status(401).json({ message: 'Forbidden. Only Faculty can create timetables.' });

     // Validate the request data
     const { error } = timetableValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });
try{
    //check course available or not
    const course = await Course.findOne({courseCode : req.body.courseCode })
    if(!course) return res.status(403).json({ message: ` ${req.body.courseCode} course doesn't exists`});

    const user = await User.findOne({f_Code : req.user.f_Code})
     if ( course.facultyCode !== user.f_Code) {
        return res.status(403).json({ message: `You are not authorized to create this course only ${course.facultyCode} can create ${req.body.courseCode} course` });
    }

    

    //to check course have staff 
    if(!course.staff) return res.status(403).json({ message: ` ${req.body.courseCode} course doesn't have staff, first assign the staff`});
     //get staff name 
     const users = await User.findOne({_id : course.staff})


    const roomCode = req.body.roomCode
    const descriptions = req.body.description[0]
    const startTime = descriptions.startTime
    const endTime = descriptions.endTime
    const date = descriptions.date
    const purpose = descriptions.purpose
    // Check if any room is already booked at the specified time
    const existingReservations = await Room.find({
        roomCode:roomCode,
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
    if (existingReservations.length > 0) {
        return res.status(400).json({ message: 'One or more rooms are already reserved for events at the specified time.' });
    }

     // Check if any room is available or not at the specified time
     const roomAvailble = await TimeTable.find({
        roomCode:roomCode,
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






    const courseCode = req.body.courseCode    
    const year = req.body.year
    const semester = req.body.semester
    const staff = course.staff

    // No events are booked at the specified time, proceed to create timetable
    const timeTable = new TimeTable({
        roomCode: roomCode,
        courseCode:courseCode,
        year: year,
        semester : semester,
        description: [{
            date:descriptions.date,
            startTime: startTime,
            endTime: endTime,
            purpose:purpose,
            facultyCode: req.user.f_Code
          
        }],
        staff : users.name
    });

    const createTimetable = await timeTable.save();
    res.status(201).json(createTimetable);





}catch(err){
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' });


}
 
})

module.exports  = router










// Check if any room is already reserved for events at the specified time
// const { roomCode, description } = req.body;
// const { startTime, endTime, date, purpose } = description[0];
// const existingReservations = await Room.find({
//     roomCode: roomCode,
//     'bookings.date': date,
//     $or: [
//         {
//             $and: [
//                 { 'bookings.startTime': { $lt: endTime } },
//                 { 'bookings.endTime': { $gt: startTime } }
//             ]
//         },
//         {
//             $and: [
//                 { 'bookings.startTime': { $eq: startTime } },
//                 { 'bookings.endTime': { $eq: endTime } }
//             ]
//         }
//     ]
// });

// if (existingReservations.length > 0) {
//     return res.status(400).json({ message: 'One or more rooms are already reserved for events at the specified time.' });
// }

// // Create timetable entry
// const timeTable = new TimeTable({
//     roomCode: roomCode,
//     courseCode:course.courseCode,
//     year: req.body.year,
//     semester: req.body.semester,
//     description: [{
//         date: date,
//         startTime: startTime,
//         endTime: endTime,
//         purpose: purpose,
//         faculty: req.user.role, // Assuming facultyCode corresponds to the user _id
//         staff: course.staff
//     }]
// });

// const createTimetable = await timeTable.save();
// res.status(201).json(createTimetable);