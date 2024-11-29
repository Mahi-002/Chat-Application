const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/showLogin',userController.showLogin)
router.post('/submitLogin',userController.submitLogin)
router.get('/signup',userController.showSignup)
router.post('/signup',userController.createUser)

router.post('/forgot-password',userController.forgotPassword);
router.post('/reset-password/:token',userController.resetPassword);

module.exports=router