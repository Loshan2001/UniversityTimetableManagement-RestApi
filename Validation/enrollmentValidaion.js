const Joi = require('@hapi/joi') 

const enrollmentValidation = (data) =>{
    const schema = {
        student : Joi.string().required(),
        studentName : Joi.string(),
        courseCode: Joi.string().regex(/^(DS|IT|BS|SE|EN)\d{4}$/).required(),
        year : Joi.string(),
        semester : Joi.string()

    }
    return  Joi.validate(data,schema)
}

module.exports.enrollmentValidation = enrollmentValidation