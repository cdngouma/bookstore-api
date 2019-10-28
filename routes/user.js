const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = (require('express')).Router();

router.post('/signup', (req, res, next) => {
    console.log("siging up..");
    const userPassword = req.body.password;
    bcrypt.hash(userPassword, 10, async (err, passwordhash) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            try {
                const user = await User.create({
                    credentials: {
                        username: req.body.username,
                        email: req.body.email,
                        password: passwordhash
                    },
                    personalInfo: {
                        retailName: req.body.retailName,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        dateOfBirth: req.body.dateOfBirth,
                        gender: req.body.gender
                    }
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
        todo: 'Implement login service'
    });
});

router.put('/:id/update', async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = extractUpdates(req.body);
        const user = await User.findByIdAndUpdate(id, updates);

    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});

function extractUpdates (data) {

}

module.exports = router;

