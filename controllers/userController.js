const User = require('../models/User')

const userController = {}

userController.getUserData = (req, res) => {
    User.findById(req.user._id)
        .select('-password')
        .then(user => {res.status(200).json(
            {
                user
            }
        )})
}

module.exports = userController