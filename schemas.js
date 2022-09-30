const Joi = require('joi');
const { number } = require('joi');

module.exports.attractionSchema = Joi.object({
    attraction: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // Can't validate the image files
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    // Image8.5 new deleteImages session added through edit and update page and it's not required, so no need to add require method. 
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

