const bcrypt = require('bcryptjs');

const User = require('../models/user');
const PersonalInfo = require('../models/user-info');

// CREATE new User using email
exports.signupDefault = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, passwordHash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        else {
            User.create({
                username: req.body.username,
                email: req.body.email,
                password: passwordHash,
                personalInfo: {
                    firstName: req.body.personalInfo.firstName,
                    lastName: req.body.personalInfo.lastName,
                    dateOfBirth: req.body.personalInfo.dateOfBirth,
                    gender: req.body.personalInfo.gender
                }
            },{
                include: [PersonalInfo]
            }).then(user => {
                res.status(201).json({
                    message: 'New user created',
                    data: user
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
}

exports.deleteUser = (req, res, next) => {
    const username = req.query.user;
    User.delete({
        where: {
            username: username
        }
    }).then(data => {
        res.status(200).json({
            message: 'User deleted'
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

/** TODO: Implement UPDATE queries for User */
/*
exports.updateUser = (req, res, next) => {
    const username = req.params.username;
    User.findOne({
        where: {
            username: username
        },
        attributes: ['id', 'username', 'email']
    }).then(user => {
        if (user) {
            const updates = extractValidProperties(req.body);
            if (updates.error) {
                return error;
            }
            else if (updates === null) {
                return res.status(200).json({
                    message: 'Nothing to update'
                });
            }

            return user.update(updates, { exclude: ['id'] }).then(updatedUser => {
                res.status(201).json({
                    message: 'User updated',
                    data: updatedUser
                });
            });
        }
        else {
            res.status(400).json({
                message: 'Not found'
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

function extractValidProperties(obj) {
    let updates = {};
    if (obj.username) {
        updates.username = obj.username;
    }
    if (obj.email) {
        updates.email = obj.email;
    }
    if (obj.password) {
        bcrypt.hash(obj.password, 8, (err, newPasswordHash) => {
            if (error) return error;
            updates.password = newPasswordHash;
        });
    }
    return updates;
}
*/

/** TODO: Implement LOGIN */

/* exports.loginDefault = (req, res, next) => {
    let identifier = {};
    if (req.body.email) {
        identifier.email = req.body.email;
    }
    else if (req.body.username) {
        identifier.username = req.body.username;
    }
    else {
        return res.status(401).json({
            error: { message: 'Auth failed' }
        });
    }

    User.findOne({
        where: identifier,
        attributes: ['password']
    }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err });
                }
                else if (!result) {
                    res.status(401).json({ message: 'Auth failed' });
                }
                else {
                    const token = jwt.sign({ username: username }, process.env.JWT_KEY, { expiresIn: "1h" });
                    res.status(200).json({
                        message: 'Auth successful',
                        data: {
                            token: token
                        }
                    });
                }
            });
        }
        else {
            res.status(401).json({ message: 'Auth failed' });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
} */