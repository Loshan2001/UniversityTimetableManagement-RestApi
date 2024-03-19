const express = require('express')
const mongoose = require('mongoose')
const app = express()
const url = 'mongodb+srv://loshansp2001:Lo$h%40n200111@afbackend.nazhnpm.mongodb.net/TimetableManagement'

//import routes
const authRoute = require('./Routes/auth')
const courseRoute = require('./Routes/course')
const roomRoute = require('./Routes/room')


//connect the database 
mongoose.connect(url,{useNewUrlParser : true}) 
const con = mongoose.connection 
con.on('open',()=>{
    console.log('mongoDB connected.....')
})

//Middelware 
app.use(express.json())

//Route middlewares 
app.use('/api/user',authRoute)

//course middlewares 
app.use('/api/course',courseRoute)

//room middlewares
app.use('/api/room',roomRoute)

app.listen(8080,()=>{
    console.log("server running on port 8080.....")
})