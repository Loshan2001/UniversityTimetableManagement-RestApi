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
        credits : req.body.credits,
        facultyCode : req.body.facultyCode
        
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

//update Course details 
router.put('/updateCourse/:id',verify,async(req,res)=>{

        //first validate admin or faculty
        if(req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Forbidden. Only Admin or faculty can update courses.'})
        
        //lets validate the course data before update the course 
        const {error} = courseRegisterValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message) 
        
  
        //checking if course already in the database 
        const coursecode = await Course.findOne( {courseCode : req.body.courseCode})
        if (coursecode) return res.status(400).send('Course already exists')
        
         
        const course = await Course.findById(req.params.id)
        
          // Check if the logged-in faculty belongs to the same department as the course
        if(req.user.role !== 'admin'){
             if (req.body.facultyCode !== req.user.f_Code) {
                 return res.status(403).json({ message: `Forbidden. you are ${req.user.f_Code} department, You can only update courses of your department. this course belongs to ${req.body.facultyCode} department` });
            } 
        }
        
        try{
           
   
        const courseCode =req.body.courseCode
        const courseName = req.body.courseName
        const description = req.body.description
        const credits = req.body.credits
        const facultyCode = req.body.facultyCode

        
     

           course.courseCode = courseCode
           course.courseName = courseName
           course.description = description 
           course.credits = credits
           course.facultyCode = facultyCode

 
  
        const course1 = await course.save()
        res.status(201).json(
            { message: 'Course updated successfully', course1 }
        )
    }catch(err){
         
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
        
}) 

//delete course 
router.delete('/courseDelete/:id',verify,async(req,res)=>{

     //first validate admin or faculty 
    if(req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Forbidden. Only Admin or faculty can delete courses.'})
    
     //checking if course already in the database 
     const courseId = await Course.findById(req.params.id)
     if (!courseId) return res.status(400).send("Course doesn't exists")

      // Check if the logged-in faculty belongs to the same department as the course
      if(req.user.role !== 'admin'){
        if ( courseId.facultyCode !== req.user.f_Code) {
            return res.status(403).json({ message: `Forbidden. you are ${req.user.f_Code} department, You can only delete courses of your department. this course belongs to ${courseId.facultyCode } department` });
            } 
        }

      try{ 
       // Find the course by ID and delete it
       const deletedCourse = await Course.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: 'Course deleted successfully.', deletedCourse });

      }catch(err){
       
        res.status(500).json({ message: 'Internal Server Error' });

       }
   

})

//get All Course 

router.get('/',verify,async(req,res)=>{
    //first validate admin or faculty 
    if(req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Forbidden. Only Admin or faculty can view course details.'})
    try{
         if(req.user.role === 'admin'){
                const courses = await Course.find()
                res.json(courses)
         }else{
            const courses = await Course.find({ facultyCode: req.user.f_Code })
            res.json(courses)
         }
          
       
    }catch(err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


// Get a Course by ID
router.get('/:id', verify, async (req, res) => {
    try {
        // Check if the user is an admin or faculty
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: 'Forbidden. Only Admin or faculty can view course detail.' });
        }

        // Find the course by ID
        const course = await Course.findById(req.params.id);

        // If the course is not found
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

         
        // Check if the logged-in faculty belongs to the same department as the course
        if(req.user.role !== 'admin'){
            if ( course.facultyCode  !== req.user.f_Code) {
             return res.status(403).json({ message: `Forbidden. you are ${req.user.f_Code} department, You can only delete courses of your department. this course belongs to ${course.facultyCode } department` });
            } 
        }

        res.json(course);
    } catch (err) {
        
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router