const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {registerValidation} = require('../Validation/userValidation')

router.post('/register',async(req,res)=>{
//lets validate the data before add a user
   const {error} = registerValidation(req.body)
   if (error) return res.status(400).send(error.details[0].message)
  
//checking if the user is already in the database 
    const emailExist = await User.findOne({email : req.body.email})
    if (emailExist) return res.status(400).send('Email already exists')

//hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt)



    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashPassword
    })
   try{
        
        const savedUsers = await user.save()
        res.send(savedUsers)
   }catch(err){
         res.status(400).send(err)
   }
})

module.exports = router