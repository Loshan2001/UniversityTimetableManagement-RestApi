const Joi = require('@hapi/joi');

const timetableValidation = (data) => {
    const schema = Joi.object({
        courseCode: Joi.string().regex(/^(DS|IT|BS|SE|EN)\d{4}$/).required(),
        roomCode :Joi.string().regex(/^[A-Z]\d{3}$/).required(),
        year: Joi.string().required(),
        semester: Joi.string().required(),
        description: Joi.array().items(Joi.object({
            date: Joi.date().required(),
            startTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), 
            endTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), 
            purpose: Joi.string(),
            facultyCode: Joi.string().optional()  
        })),
        staff: Joi.string().optional()
    });
    
    return schema.validate(data);
}

module.exports.timetableValidation = timetableValidation;
