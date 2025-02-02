const express = require('express')
const mongoose = require('mongoose')
const app = express()
const url = 'mongodb+srv://loshansp2001:Lo$h%40n200111@afbackend.nazhnpm.mongodb.net/TimetableManagement'
const cookieParser = require('cookie-parser');
//import routes
const authRoute = require('./Routes/auth')
const courseRoute = require('./Routes/course')
const roomRoute = require('./Routes/room')
const timetableRoute = require('./Routes/timetable')
const studentEnrollmentRoute = require('./Routes/student')
 
//connect the database 
mongoose.connect(url,{useNewUrlParser : true}) 
const con = mongoose.connection 
con.on('open',()=>{
    console.log('mongoDB connected.....')
})

//Middelware 
app.use(express.json())
//////////////////////////////////////////////////////////////
app.use(cookieParser()); // Use cookie-parser middleware

//Route middlewares 
app.use('/api/user',authRoute)

//course middlewares 
app.use('/api/course',courseRoute)

//room middlewares
app.use('/api/room',roomRoute)

//timetable middlewares 
app.use('/api/timetable',timetableRoute)

//studentEnrollment middlewares
app.use('/api/student',studentEnrollmentRoute)

 
app.listen(8080,()=>{
    console.log("server running on port 8080.....")
})