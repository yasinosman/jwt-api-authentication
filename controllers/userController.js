const User = require('../models/User')

const controller = {}

controller.getCurrentUser = (req, res) => {
    User.findById(req.user._id)
        .select('-password')
        .then(user => {res.status(200).json(
            {
                user
            }
        )})
}

module.exports = controller