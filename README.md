[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)


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
         