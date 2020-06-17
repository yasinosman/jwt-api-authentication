const jwt = require('jsonwebtoken')

const authObj = {}

authObj.verifyToken = (req, res, next) => {
    //Check if token exists
    const token = req.header('token')

    if(!token){
        return res.status(401).json(
            {
                error   : {
                    message : 'Bu islemi gerceklestirmek icin once giris yapmanız gerekmektedir.',
                    error   : 'Invalid token.'
                },
                data    : null
            }
        )
    } else {
        try{
            const payload = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = payload //jwt payload is mongoDB user._id
            return next()
        } catch(err) {
            return res.status(401).json(
                {
                    error   : {
                        message : 'Bu islemi gerceklestirmek icin once giris yapmanız gerekmektedir.',
                        error   : err
                    },
                    data    : null
                }
            )
        }
    }

}

module.exports = authObj