const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().required().min(0),
    // image: joi.string().required().allow("", null)
    category: joi.string()
}).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        Comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})

module.exports.bookingSchema = joi.object({
    booking: joi.object({
        name: joi.string().required(),
        checkIn: joi.date().required(),
        checkOut: joi.date().greater(joi.ref("checkIn")).required(), //checks check out date is greater than check in
        number: joi.number().min(1).max(4).required(),
        email: joi.string().email().required(),
        phoneNum: joi.string().pattern(/^[0-9]{10}$/).required(), // checks on 10digit phone number
        specialReq: joi.string().allow("")
    }).required()
})

