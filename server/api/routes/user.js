const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();

router.post('/signup', UserController.signupDefault);

// router.post('/login', UserController.loginDefault);

// TODO: Implement UPDATE routes

//router.put('/update/:username/credentials', UserController.updateUserCredentials);
//router.put('/update/:username/info', UserController.updateUserPersonalInfo);
//router.patch('/update/:username/address', UserController.updateUserAddress);

router.delete('/remove/:username', UserController.deleteUser);

module.exports = router;