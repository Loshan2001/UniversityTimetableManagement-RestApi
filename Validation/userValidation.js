const Joi = require('@hapi/joi')
//Register validation
const registerValidation = (data)=>{
    const schema = {
        name : Joi.string().min(5).max(100).required(),
        email : Joi.string().min(8).max(355).required().email(),
        password : Joi.string().min(8).max(50).required()
    }
   return  Joi.validate(data,schema)
}


module.exports.registerValidation = registerValidation