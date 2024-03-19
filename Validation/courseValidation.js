const Joi = require('@hapi/joi') 

const courseRegisterValidation = (data) =>{
    const schema = {
        courseCode: Joi.string().regex(/^(DS|IT|BS|SE|EN)\d{4}$/).required(),
        courseName : Joi.string().required(),
        description : Joi.string().required(),
        credits : Joi.number().required(),
        faculty : Joi.string().optional()

    }
    return  Joi.validate(data,schema)
}

module.exports.courseRegisterValidation = courseRegisterValidation