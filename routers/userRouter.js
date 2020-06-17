const userController    = require('../controllers/userController')
const router            = require('express').Router()
const auth              = require('../middleware/auth')

router.get('/currentUser', auth.verifyToken, userController.getUserData)

module.exports = router