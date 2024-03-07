const Joi = require('joi');

module.exports.postSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required()
    }).required()
});