const express = require('express')
const router = express.Router()
const verify = require('../middleware/verifyToken')
const Course = require('../models/Course')
const User = require('../models/User')
//create course
router.post('/add',verify,async(req,res)=>{
   
    if(req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden. Only Admin can create courses.'});
     
    const course = new Course({
        courseCode : req.body.courseCode,
        courseName : req.body.courseName,
        description : req.body.description,
        credits : req.body.credits
        
    })
    try{
        const addCourse = await course.save()
        res.status(201).json(
            { message: 'Course created successfully', addCourse }
        )
    }
    catch(err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


//assign faculty to course 
router.put('/:courseId/assign-faculty',verify,async(req,res)=>{
    if(req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden. Only Admin can assign faculty to courses.'});

    const { facultyID } = req.body;
    const { courseId } = req.params; 

    try{
        const courses = await Course.findById(courseId)
        if (!courses)  return res.status(404).json({ message: 'Course not found' });
        courses.faculty = facultyID;
        await courses.save();
        res.status(200).json({ message: 'Faculty assigned to the course successfully', courses })
        res.send(facultyID.name)

        // const faculty = await User.findById(facultyID)
        // if (!faculty) {
        //     return res.status(404).json({ message: 'Faculty not found' });
        // }
        // console.log('Faculty Name:', faculty.name);
        
    }catch(err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router