const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = (require('express')).Router();

router.post('/signup', (req, res, next) => {
    console.log("siging up..");
    const data = req.body;
    const userPassword = data.credentials.password;
    bcrypt.hash(userPassword, 10, async (err, passwordhash) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            try {
                const user = await User.create({
                    retailerName: data.retailerName,
                    credentials: {
                        username: data.credentials.username,
                        email: data.credentials.email,
                        password: passwordhash
                    }/*,
                    personalInfo: {
                        retailName: req.body.retailName,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        dateOfBirth: req.body.dateOfBirth,
                        gender: req.body.gender
                    }*/
                });

                console.log(user);
                res.status(200).json({
                    message: 'new user created',
                    data: user
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        }
    });
});

/* TODO: Implement Login */
router.post('/login', (req, res, next) => {
    res.status(200).json({
        todo: 'Login service unavailable'
    });
});

// Update username, email, or/and password
router.put('/:id/credentials', async (req, res, next) => {
    const id = req.params.id;
    bcrypt.hash(req.body.password, 10, async (err, passwordhash) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            try {
                const personalInfo = {};
                if (req.body.username) personalInfo.username = req.body.username;
                if (req.body.email) personalInfo.email = req.body.email;
                if (req.body.password) personalInfo.password = passwordhash;

                const updatedUser = await User.findByIdAndUpdate(id, personalInfo);
                if (updatedUser) {
                    res.status(200).json({
                        message: 'Updated credentials'
                    });
                } else {
                    res.status(404).json({
                        message: 'Not found'
                    });
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        }
    });
});

// Update personal informations
router.put('/:id/profile', async (req, res, next) => {
    try {
        const id = req.params.id;
        const personalInfo = {};
        if (req.body.firstName) personalInfo.firstName = req.body.firstName;
        if (req.body.lastName) personalInfo.lastName = req.body.lastName;
        if (req.body.dateOfBirth) personalInfo.dateOfBirth = req.body.dateOfBirth;
        if (req.body.gender) personalInfo.gender = req.body.gender;

        const user = await User.findByIdAndUpdate(id, personalInfo);
        if (user) {
            user.remove('credentials');
            user.remove('connectInfo');
            res.status(200).json({
                message: 'Updated profile',
                item: user
            });
        } else {
            res.status(404).json({
                message: 'Not found'
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});

router.delete('/remove/:id', async (req, res, nect) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.status(200).json({
                message: 'Account deleted'
            });
        } else {
            res.status(404).json({
                message: 'Not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

module.exports = router;

