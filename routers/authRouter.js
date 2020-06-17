const router    = require('express').Router()

const authController = require('../controllers/authController')


router.post('/register', authController.registerController)

router.post('/login', authController.loginController)

module.exports = router