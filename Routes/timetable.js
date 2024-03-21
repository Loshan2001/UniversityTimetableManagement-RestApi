const express = require('express')
const router = express.Router() 
const mongoose = require('mongoose')
const TimeTable = require('../models/Timetable')
const verify = require('../middleware/verifyToken')
const Course = require('../models/Course')
const User = require('../models/User')
const Room = require('../models/Room')
const Enrollment = require('../models/Enrollment')
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

//delete timetable 
router.delete('/deleteTimetable/:id', verify, async (req, res) => {
    try {
        // First validate faculty
        if (req.user.role !== 'faculty') return res.status(401).json({ message: 'Forbidden. Only Faculty can delete timetables.' });

        // Check if the timetable exists
        const timetable = await TimeTable.findById(req.params.id);
        if (!timetable) return res.status(404).json({ message: 'Timetable not found.' });

        // Check if the faculty deleting the timetable is authorized
        if (timetable.description[0].facultyCode !== req.user.f_Code) {
            return res.status(403).json({ message: 'You are not authorized to delete this timetable.' });
        }

        // If the faculty is authorized, delete the timetable
        await TimeTable.findByIdAndDelete(req.params.id);
        
        // Respond with success message
        res.json({ message: 'Timetable deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





//get All timetables 
router.get('/timetables', verify, async (req, res) => {
    try {
        // First, check if the user is authenticated
        if (req.user.role !== 'faculty') {
            return res.status(401).json({ message: 'Forbidden. Only Faculty can access timetables.' });
        }
      
        // Fetch all timetables
        const timetables = await TimeTable.find({});

        // If no timetables are found, return a message
        if (!timetables || timetables.length === 0) {
            return res.status(404).json({ message: 'No timetables found.' });
        }

        // Return the timetables
        res.status(200).json(timetables);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});















//update timetable 
router.put('/updateTimetable/:id', verify, async (req, res) => {
     // First validate faculty
     if (req.user.role !== 'faculty') return res.status(401).json({ message: 'Forbidden. Only Faculty can update timetables.' });

     // Validate the request data
     const { error } = timetableValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });
try{
    const timetable = await TimeTable.findById(req.params.id);
    if(!timetable) return res.status(403).json({ message: ` timetable doesn't exists`}); 
    
     //check course available or not
     const course = await Course.findOne({courseCode : req.body.courseCode })
     if(!course) return res.status(403).json({ message: ` ${req.body.courseCode} course doesn't exists`});
 
    const user = await User.findOne({f_Code : req.user.f_Code})
     if ( course.facultyCode !== user.f_Code) {
        return res.status(403).json({ message: `You are not authorized to create this course only ${course.facultyCode} can update ${req.body.courseCode} course` });
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
    // const courseCode = req.body.courseCode    
    // const year = req.body.year
    // const semester = req.body.semester
  


    timetable.courseCode = req.body.courseCode;
    timetable.roomCode = roomCode;
    timetable.year = req.body.year;
    timetable.semester = req.body.semester;
    timetable.staff = users.name;
    timetable.description [
        {
            date : date,
            startTime:startTime,
            endTime: endTime,
            purpose:purpose,
            facultyCode:req.user.f_Code 

        }
    ]
    
    const timeTable1 = await timetable.save()
    res.status(201).json(
        { message: 'timetable updated successfully', timeTable1 }
    )

}catch(err){
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' });


}
 
})
//Student view their timetable 
router.get('/studentTimetables',verify,async(req,res)=>{
    //validate the student role
    if (req.user.role !== 'student') return res.status(401).json({ message: 'Forbidden. Only student can view timetables.' });

    try{
        const studentYear = req.user.year
        const studentSemester = req.user.semester 
        const enrollment = await Enrollment.find({student : req.user._id})
        if(!enrollment) return res.status(401).json({ message: "Forbidden. you didn't enroll any courses yet" });
        
        //only view enrolled course timetable 
        const selectedCoursse = enrollment.map(selected=>selected.courseCode)
        //console.log(selectedCoursse)

        const timetable = await TimeTable.find({year : studentYear , semester :studentSemester ,courseCode : selectedCoursse})
        res.json(timetable)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

//staff view their timetable

router.get('/staffTimetables',verify,async(req,res)=>{
    //validate the student role
    if (req.user.role !== 'staff') return res.status(401).json({ message: 'Forbidden. Only staff can view timetables.' });

    try{

        const course = await Course.findOne({staff : req.user._id})
        if(!course) return res.status(401).json({ message: "Forbidden. staff not assign" });

        const timetable = await TimeTable.find({courseCode : course.courseCode})

           res.json(timetable)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' });
    }

})


module.exports  = router

 