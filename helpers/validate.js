const Joi = require('@hapi/joi')

const validationObject = {}

validationObject.registerValidation = (name, email, password) => {
    const schema = Joi.object({
        name    : Joi.string().min(2).required(),
        email   : Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    })

    const input = {
        name,
        email,
        password
    }

    return schema.validate(input)
}

validationObject.loginValidation = (email, password) => {
    const schema = Joi.object({
        email   : Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    })

    const input = {
        email,
        password
    }

    return schema.validate(input)
}

module.exports = validationObject
