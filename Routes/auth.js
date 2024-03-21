const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser'); // Import cookie-parser
dotenv.config()
const {registerValidation , loginValidation} = require('../Validation/userValidation')

router.post('/register',async(req,res)=>{
//lets validate the data before register a user
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
        password : hashPassword,
        role : req.body.role,
        f_Code : req.body.f_Code,
        year : req.body.year,
        semester : req.body.semester,
        totalRooms : req.body.totalRooms
    })
   try{
        
        const savedUsers = await user.save()
        res.send(savedUsers)
   }catch(err){
         res.status(400).send(err)
   }
})


router.post('/login',async(req,res)=>{
    // Validate the data before login as a user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database 
    const user = await User.findOne({email : req.body.email});
    if (!user) return res.status(400).send('Email is not found');

    // Check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');


    //create and assign a tokken 
    const token  = jwt.sign({_id : user._id},process.env.TOKEN_SECRET)
    // Set token in a cookie////////////////////////////////////////////////////////////////////////////////
    res.cookie('auth-token', token, {
        httpOnly: true,
        expires: new Date(Date.now() +  10 * 60 * 1000), // Set expiry time to 10 minutes from now
    });

   // res.header('auth-token',token)
    res.send("Success! You are logged in");
    
});


module.exports = router