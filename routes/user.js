const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserController');

//users routes
router.get('/', UserController.index)
router.get('/show/:id', UserController.show)
router.post('/register', UserController.register)
router.post('/login', UserController.login)



module.exports = router