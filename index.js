const express = require('express')
const mongoose = require('mongoose')
const app = express()
const url = 'mongodb+srv://loshansp2001:Lo$h%40n200111@afbackend.nazhnpm.mongodb.net/TimetableManagement'

//connect the database 
mongoose.connect(url,{useNewUrlParser : true}) 
const con = mongoose.connection 
con.on('open',()=>{
    console.log('mongoDB connected.....')
})

app.listen(8080,()=>{
    console.log("server running on port 8080.....")
})    