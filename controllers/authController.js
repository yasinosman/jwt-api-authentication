const bcrypt    = require('bcryptjs')
const User      = require('../models/User')
const validate  = require('../helpers/validate')
const jwt       = require('jsonwebtoken')

const authController = {}

authController.registerController = async (req, res) => {
    //Validate user input
    let name, email, password
    req.body.hasOwnProperty('name') ? name = req.body.name : name = ""
    req.body.hasOwnProperty('email') ? email = req.body.email : email = ""
    req.body.hasOwnProperty('password') ? password = req.body.password : password = ""

    const validation = validate.registerValidation(name, email, password)

    //Error handling
    if(validation.error){
        if(validation.error.details[0].type === 'string.min'){
            //Short input error
            const invalidInput = validation.error.details[0].context.key
            const invalidInputLength = validation.error.details[0].context.limit
            return res.status(400).json(
                {
                    error   : {
                        message : `Gecersiz ${invalidInput} girdisi, ${invalidInput} en az ${invalidInputLength} karakterden olusmalidir.`,
                        error   : validation.error
                    },
                    data    : null
                }
            )  
        } if(validation.error.details[0].type === 'string.email'){
            //Invalid e mail adress error
            return res.status(400).json(
                {
                    error   : {
                        message : 'Lutfen gecerli bir email adresi giriniz.',
                        error   : validation.error
                    },
                    data    : null
                }
            )
        } if(validation.error.details[0].type === 'string.empty'){
            //Empty input error
            const invalidInput = validation.error.details[0].context.key
            return res.status(400).json(
                {
                    error   : {
                        message : `${invalidInput} kismi bos birakilamaz, lutfen tekrar deneyin.`,
                        error   : validation.error
                    },
                    data    : null
                }
            )
        } 
    } else {
        //If user input is valid, check if the user exists

        const userExists = await User.findOne({email})

        if(userExists){
            return res.status(400).json(
                {
                    error   : {
                        message : 'Bu email adresiyle kayitli bir kullanici bulundu. Lutfen giris yapmayı deneyin.',
                        error   : 'User already exists.'
                    },
                    data    : null
                }
            )
        } else {
            //If user does not exist, save the user

            //Hash the password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = new User(
                {
                    name,
                    email,
                    password : hashedPassword
                }
            )

            try{
                const savedUser = await user.save()
                const token = jwt.sign({_id : savedUser._id}, process.env.TOKEN_SECRET, {expiresIn: "2 days"})
                return res.status(201).json(
                    {
                        error   : null,
                        data    : {
                            message : 'Kullanici basariyla kaydedildi.',
                            userID  : savedUser._id
                        },
                        token   : token
                    }
                )
            } catch(err){
                console.log(err)
                return res.status(400).json(
                    {
                        error   : {
                            message : 'Gecersiz kullanıcı girdisi, lutfen tekrar deneyin',
                            error   : err
                        },
                        data    : null
                    }
                )
            }
        }
    }
}

authController.loginController = async(req, res) => {
    //First validate user input
    let email, password
    req.body.hasOwnProperty('email') ? email = req.body.email : email = ""
    req.body.hasOwnProperty('password') ? password = req.body.password : password = ""

    const validation = validate.loginValidation(email, password)

    //Error handling
    if(validation.error){
        if(validation.error.details[0].type === 'string.min'){
            //Short input error
            const invalidInput = validation.error.details[0].context.key
            const invalidInputLength = validation.error.details[0].context.limit
            return res.status(400).json(
                {
                    error   : {
                        message : `Gecersiz ${invalidInput} girdisi, ${invalidInput} en az ${invalidInputLength} karakterden olusmalidir.`,
                        error   : validation.error
                    },
                    data    : null
                }
            )  
        } if(validation.error.details[0].type === 'string.email'){
            //Invalid e mail adress error
            return res.status(400).json(
                {
                    error   : {
                        message : 'Lutfen gecerli bir email adresi giriniz.',
                        error   : validation.error
                    },
                    data    : null
                }
            )
        } if(validation.error.details[0].type === 'string.empty'){
            //Empty input error
            const invalidInput = validation.error.details[0].context.key
            return res.status(400).json(
                {
                    error   : {
                        message : `${invalidInput} kismi bos birakilamaz, lutfen tekrar deneyin.`,
                        error   : validation.error
                    },
                    data    : null
                }
            )
        } 
    } else {
        //If user input is valid check if user exists
        const user = await User.findOne({email})

        //If user does not exist, throw an error
        if(!user){
            return res.status(400).json(
                {
                    error   : {
                        message : 'Hatalı email veya sifre girdiniz, lutfen tekrar deneyin.',
                        error   : 'User does not exist.'
                    },
                    data    : null
                }
            )
        } else {
            //If user exists compare passwords
            const login = await bcrypt.compare(password, user.password)
            
            //If password is wrong throw an error
            if(!login){
                return res.status(401).json(
                    {
                        error   : {
                            message : 'Hatalı email veya sifre girdiniz, lutfen tekrar deneyin.',
                            error   : 'Invalid password.'
                        },
                        data    : null
                    }
                )
            } else {
                //Create and assign json web token
                const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET, {expiresIn: "2 days"})
                return res.status(200).json(
                    {
                        error   : null,
                        data    : {
                            message : 'Giris basarili, hos geldiniz.'
                        },
                        token   : token
                    }
                )
            }
        }
    }
}

module.exports = authController