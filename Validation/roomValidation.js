const Joi = require('@hapi/joi')

const roomReservationValidation = (data)=>{
    const schema = {
        roomCode :Joi.string().regex(/^[A-Z]\d{3}$/).required(),
        capacity: Joi.number().required(),
        features: Joi.array().items(Joi.string()),
        // availability: Joi.array().items(Joi.object({
        //     dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        //     startTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),//.message('Start time must be in the format HH:MM (24-hour)'),
        //     endTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required()//.message('End time must be in the format HH:MM (24-hour)')
        // })),
        bookings: Joi.array().items(Joi.object({
            date: Joi.date().required(),
            startTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), 
            endTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), 
            purpose: Joi.string(),
            faculty: Joi.string().optional() // Assuming faculty ID is a string
        }))
    }

    return Joi.validate(data,schema)
}

module.exports.roomReservationValidation = roomReservationValidation