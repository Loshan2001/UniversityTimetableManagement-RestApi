[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)


TOKEN_SECRET = lksldklskdlskerojvdnc


Unit Testing for Registration 
      i use jest for unit testing 

   path : __tests__/contoller/auth.test.js 

  1.   check user register enter invalid inputs(name,password,email,role)
  2.   check user register enter  valid inputs(name,password,email,role)
  3.   when you user already registered it should send status code of 400  



User Routes 

1.     /api/user/register 

         =>  User(Admin/Student/Faculty/Staff) Registration 
         
          password will be hashed using bcrypt
          

2.    /api/user/login    
         =>  User Login 

         admin (email : loshan@gmail.com , password : loshan200111)

         only have 3 faculties

         computing(email : computing@gmail.com , password : Computing)
         BusinessSchool(email : businessSchool@gmail.com , password : BusinessSchool)
         Engineering(email : engineering@gmail.com , password : Engineering)

         i use cookies and jwt
         cookies expires within 10mins you have to login again


course Routes

1.    /api/course/add 
         => only admin have rights to create courses
          
         ex:   "courseCode" :"SE3010",       
               "courseName" : "SEP",
               "description" : "Software Engineering Process",
               "credits" : 4,
               "facultyCode" : "CS"

2.    /api/course/:courseId/assign-faculty
         => only admin can assign faculty to courses


3.    /api/course/updateCourse/:id 
         =>only admin and authorized faculty can update course 

4.    /api/course/courseDelete/:id 
         =>only admin and authorized faculty have rights to delete course 

5.    /api/course/
         =>only admin and authorized faculty view  all course 

6.    /api/course/:id
         =>only admin and authorized faculty view  specific course 

7.    /api/course/:courseId/assign-staff 
         =>only authorized faculty can assign staff to course 

8.    /api/course/:courseId/resign-staff 
         =>Only authorized faculty have the rights to resign staff courses


Room Reservation Route

1.   /api/room/reserve 
         =>Only authorized faculty have the rights to reserve room 
         =>there is no overlapping 

        The student will be notified when the faculty organizes an event 
        ( notification is sent to all students)

2.    /api/room/unreserve/:roomId
         =>Only authorized faculty have the rights to unreserve room 

         The student will be notified when the faculty cancel the event 
          ( notification is sent to all students)


Notification Route 

1.    /api/student/viewNotification 
         => only student can view faculty notifications 



Timetable Route 

1.    /api/timetable/addTimetable 
         =>only authorized faculty can create timetable 

         there is no overlapping 
         Timetables cannot be created for the same day and time at the same location, but they can be created for the same day and time at different locations 

2.    /api/timetable/updateTimetable/:id 

         =>only authorized faculty can update timetable 
         there is no overlapping 
         Timetables cannot be updated for the same day and time at the same location, but they can be created for the same day and time at different locations 

3.    /api/timetable/deleteTimetable/:id 
         =>only authorized faculty can delete timetable 

4.    /api/timetable/timetables
         => any faculty have rights to view timetables 

5.    /api/timetable/studentTimetables 
         => Only students can view the timetables for modules in which they are enrolled

6.    /api/timetable/staffTimetables 
         =>  Only staff can view the timetables for modules in which they are assigned



student Enrollement Routes


1.    /api/student/enroll 
         => student enroll course using ID and course ID
         =>student can't enroll using others' ID 
         => Students are only able to enroll in courses designated for their academic year


2.    /api/student/unenroll 
         => student unenroll course using ID and course ID
         => student can't unenroll using others' ID 
         => Authorized faculty and administrator have the ability to unenroll students from courses

3.    /api/student/viewAllenrolls 
         => Both faculty members and administrators have access to view student enrollments 
   
4.    /api/student/viewEnrolls/:studentId
         => student can view enrolled courses using ID 
         => student can't view others' courses 
         => Both faculty members and administrators have access to view student enrolled courses using student ID

5.    /api/student/viewStudent/:courseId 
         =>only Staff members have the ability to view both enrolled students and the total number of students for their respective modules using course ID
   









more about.....


1. admin can create course and assign appropriate faculty to course 
                1.1 course verificaton => to check already course available or not
                1.2 assign appropriate faculty => to check faculty f_Code and courseCode's first two letters 
                                ex: 
                                courseCode      f_Code      appropriate faculty

                                "SE3040"        "CS"        Computing 
                                "DS3040"        "CS"        Computing
                                "IT3040"        "CS"        Computing 

                                "BS3020"        "BS"        BusinessSchool

                                "EN3020"        "EN"        Engineering

2. admin and faculty can update,delete,view course details 
   i assign 3 faculties (CS , BS , EN) 
   Faculties can only view, update, and delete courses that belong to them 

3. facutlty can reserve rooms for events,
            Time Overlap Checking:
            It specifically looks for two scenarios:
                       => If the existing booking starts before your requested end time and ends after your      requested start time. This means there's an overlap.
                       => If the existing booking starts and ends exactly at the same time as your requested booking. This also indicates an overlap.

4. faculty can assign staff and resign staff 
            only appropriate faculty can resign staff

5. faculty can create timetable 
            cannot create timetable same time same day same location 
            but faculty can create same time same day but different location 
            

            You can't schedule two events in the same place at the same time on the timetable. But, you can schedule different events at the same time on the same day, as long as they're in different places. Also, once a time is scheduled on the timetable, no other events can be scheduled for that same time.


6. Student can enroll courses 
         but student can enroll their registered year courses 
         student can't enroll or unenroll other student courses
         faculty [only specific faculty] and admin have permission to unenroll students from courses 
         

         only admin and faculty view student enrollment 
         student view their enrolled courses using student id, can't view others course 
         
         staff can view enrolled students using course id 
         
         student view only enrolled course timetable 

         staff view their timetable only

5. manage notification
         students will be notified, when faculty reserve or unreserve room
         only student can view notifications