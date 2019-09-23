const express = require('express');
const UserController = require('../controllers/user-controller');
const checkAuth = require('../auth/auth');
const router = express.Router();

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

// Update user profile
router.patch('/update', checkAuth, UserController.updateUser);

router.delete('/remove', checkAuth, UserController.deleteUser);

module.exports = router;