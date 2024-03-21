const router = require('express').Router() 
const Enrollment = require('../models/Enrollment')
const User = require('../models/User')
const Course = require('../models/Course')
const verify = require('../middleware/verifyToken')

//student enroll
router.post('/enroll',verify,async(req,res)=>{
    // First validate student
    if (req.user.role !== 'student') return res.status(401).json({ message: 'Forbidden. Only student can enroll courses.' });
 try{  
    const user = await User.findOne({_id : req.user._id})
     
 
    //check specific student can enroll course with his specific id
    if (user._id != req.body.student) return res.status(401).json({ message: `Forbidden. hey ${user.name}!, you can't enroll from others ID.` });

    //check course is available or not 
    const course = await Course.findOne({courseCode :req.body.courseCode})  
    if(!course) return  res.status(401).json({ message: `course doesn't exist` });

    const enrolls = await Enrollment.findOne({courseCode : req.body.courseCode , student : req.body.student})
    if(enrolls) return  res.status(401).json({ message: ` you have already enrolled` });
 

     // Extract the third letter of the course code
     const thirdLetterCourseCode = req.body.courseCode[2];
     // Extract the second letter of the year
     const secondLetterYear = user.year[1];

     // Check if the third letter of the course code is equal to the second letter of the year
     if (thirdLetterCourseCode !== secondLetterYear) {
         return res.status(401).json({ message: ` Forbidden. only ${req.body.courseCode[2]} year student can enter this course. you are ${user.year[1]} year student` });
     }
    
     const enrollment = new Enrollment({
        student : req.body.student,
        studentName : user.name,
        courseCode : req.body.courseCode,
        year : user.year,
        semester : user.semester
     })

     const enrolled = await enrollment.save()
     res.status(201).json(enrolled);

}catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
 }


}) 

//student unenroll
router.post('/unenroll', verify, async (req, res) => {
    try {
        // First validate user role
        if (req.user.role !== 'student' && req.user.role !== 'admin' && req.user.role !== 'faculty') 
            return res.status(401).json({ message: 'Forbidden. Only student or admin or faculty can unenroll from courses.' });
        
         // Check if the course exists
         const course = await Course.findOne({ courseCode: req.body.courseCode });
         if (!course) 
             return res.status(401).json({ message: `Course doesn't exist.` });
     
        const user = await User.findOne({ _id: req.user._id });

        // Check specific student can unenroll course with his specific id
        if(req.user.role === 'student'){
            if (user._id.toString() !== req.body.student) 
                    return res.status(401).json({ message: `Forbidden. Hey ${user.name}!, you can't unenroll from others' IDs.` });
     
       
                // Check if the student is already enrolled in the course
                 const enrollment = await Enrollment.findOne({ courseCode: req.body.courseCode, student: req.body.student });
                        if (!enrollment) 
                        return res.status(401).json({ message: `You are not enrolled in this course.` });
       
                 // Remove the enrollment
                 await Enrollment.deleteOne({ _id: enrollment._id });
        }
        else if(req.user.role === 'faculty'){
                //
                if(course.facultyCode !== user.f_Code)
                return  res.status(401).json({ message: `only ${course.facultyCode} faculty can unenroll in this course.` });

                const enrollment = await Enrollment.findOne({ courseCode: req.body.courseCode, student: req.body.student });
                if (!enrollment) return res.status(401).json({ message: `didn't enroll yet` });
                await Enrollment.deleteOne({ _id: enrollment._id });
        }
        else{
                const enrollment = await Enrollment.findOne({ courseCode: req.body.courseCode, student: req.body.student });
                if (!enrollment) return res.status(401).json({ message: `didn't enroll yet` });
                await Enrollment.deleteOne({ _id: enrollment._id });
                 
        }
    
        res.status(200).json({ message: 'Unenrolled successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
})

//admin and faculty view student enrollment 
router.get('/viewAllenrolls', verify, async (req, res) => {
     // First validate user role
     if ( req.user.role !== 'admin' && req.user.role !== 'faculty') 
     return res.status(401).json({ message: 'Forbidden. Only admin or faculty can unenroll from courses.' });
 
    try{
            const enrollment = await Enrollment.find()
            res.json(enrollment)
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }

})


//student view their enrolled courses using student id 
router.get('/viewEnrolls/:studentId',verify,async(req,res)=>{
     // First validate user role
     if (req.user.role !== 'student' && req.user.role !== 'admin' && req.user.role !== 'faculty') 
     return res.status(401).json({ message: 'Forbidden. Only student or admin or faculty can view student enrolled courses.' });
     

     try{
        if(req.user.role === 'student'){
            const user = await User.findOne({_id : req.user._id})
            if (user._id.toString() !== req.params.studentId) 
                    return res.status(401).json({ message: `Forbidden. Hey ${user.name}!, you can't view  others' enrolled courses.` });
     
        }

        const enrollment = await Enrollment.find({student : req.params.studentId})
         
            
          // Check if any enrollments exist for the given student
          if (enrollment.length === 0) 
          return res.status(404).json({ message: `No enrollments found` });
      
        
        res.json(enrollment)
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
 
})

//staff view enrolled students using course id 
router.get('/viewStudent/:courseId',verify,async(req,res)=>{
    if (req.user.role !== 'staff')  return res.status(401).json({ message: 'Forbidden. Only staff can view enrolled student.' });
       
        try{
            const allcourse = await Course.findOne({staff : req.user._id})
            const course = await Course.findOne({_id : req.params.courseId})

            //check assigned staff or not
            if(course.staff.toString() !== req.user._id.toString() ) return res.status(401).json({ message: `Forbidden. ${req.user.name} not assigned for ${course.courseCode}.` });
    
            
            
            //check courseCode are same or not
            if(course.courseCode !== allcourse.courseCode) return res.status(401).json({ message: `Forbidden. course doesn't match` });

             // Find all enrollments for the given course code
             const enrollments = await Enrollment.find({ courseCode: course.courseCode });

            // Extract student names from enrollments
            const studentNames = enrollments.map(enrollment => enrollment.studentName);

            // Get the total number of students
            const totalStudents = studentNames.length;

            res.json({
                totalStudent : totalStudents,
                 students: studentNames
                 });
             

        }catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
})

module.exports = router