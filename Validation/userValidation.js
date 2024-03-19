const Joi = require('@hapi/joi')
//Register validation
const registerValidation = (data)=>{
    const schema = {
        name : Joi.string().min(5).max(100).required(),
        email : Joi.string().min(8).max(355).required().email(),
        password : Joi.string().min(8).max(50).required(),
        role : Joi.string().valid('student', 'admin', 'staff', 'faculty').required(),
        f_Code : Joi.string().when('role',{is : 'faculty', then : Joi.required()}),
        semester : Joi.string().when('role',{is : 'student' , then : Joi.required()}),
        year : Joi.string().when('role',{is : 'student' , then : Joi.required()}),
        totalRooms : Joi.number().when('role',{is : 'faculty' , then : Joi.required()})
    }
   return  Joi.validate(data,schema)
}
//Login validation
const loginValidation = (data)=>{
    const schema = {
         
        email : Joi.string().min(8).max(355).required().email(),
        password : Joi.string().min(8).max(50).required()
    }
   return  Joi.validate(data,schema)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation