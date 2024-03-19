const express = require('express')
const router = express.Router()
const verify = require('../middleware/verifyToken')
const Course = require('../models/Course')
const User = require('../models/User')
const {courseRegisterValidation} = require('../Validation/courseValidation')
//create course
router.post('/add',verify,async(req,res)=>{
   
    //first validate admin
    if(req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden. Only Admin can create courses.'});
     
    //lets validate the course data before admin add course 
    const {error} = courseRegisterValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    //checking if course already in the database 
    const coursecode = await Course.findOne( {courseCode : req.body.courseCode})
    if (coursecode) return res.status(400).send('Course already exists')

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
        // to check course is available or not
        const courses = await Course.findById(courseId)
        if (!courses)  return res.status(404).json({ message: 'Course not found' });

        // to check faculty is available or not
        const faculty = await User.findById(facultyID)
        if (!faculty)  return res.status(404).json({ message: 'Faculty not found' });

        //to check faculty have appropriate f_Code 
        if(faculty.f_Code === 'CS'){
            // Check if the courseCode matches the specified patterns
            const validCourseCodes = ['SE', 'DS', 'IT'];
            const isValidCourseCode = validCourseCodes.some(code => courses.courseCode.startsWith(code));
            if (isValidCourseCode) {
                courses.faculty = facultyID;
            }

        }

         //to check faculty have appropriate f_Code 
         if(faculty.f_Code === 'EN'){
            // Check if the courseCode matches the specified patterns
            const validCourseCodes = ['EN'];
            const isValidCourseCode = validCourseCodes.some(code => courses.courseCode.startsWith(code));
            if (isValidCourseCode) {
                courses.faculty = facultyID;
            }else{
                return res.status(400).json({ message: 'Invalid faculty or course combination' });
            }

        }
        //to check faculty have appropriate f_Code 
         if(faculty.f_Code === 'EN'){
            // Check if the courseCode matches the specified patterns
            const validCourseCodes = ['EN'];
            const isValidCourseCode = validCourseCodes.some(code => courses.courseCode.startsWith(code));
            if (isValidCourseCode) {
                courses.faculty = facultyID;
            }else{
                return res.status(400).json({ message: 'Invalid faculty or course combination' });
            }

        }
        //to check faculty have appropriate f_Code 
        if(faculty.f_Code === 'BS'){
            // Check if the courseCode matches the specified patterns
            const validCourseCodes = ['BS'];
            const isValidCourseCode = validCourseCodes.some(code => courses.courseCode.startsWith(code));
            if (isValidCourseCode) {
                courses.faculty = facultyID;
            }else{
                return res.status(400).json({ message: 'Invalid faculty or course combination' });
            }

        }

        await courses.save();
      
    //    res.status(200).json({ message: 'Faculty assigned to the course successfully', courses })
    //     res.send(facultyID.name)
        res.status(200).json({courses, message : ` ${courses.courseCode} course assign to ${faculty.name} faculty by ${req.user.name} `})
        
        

    
        
    }catch(err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router