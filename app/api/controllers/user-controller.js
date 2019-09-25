const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shortUUID = require('shortid');

const User = require('../models/user');

// create new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, passwordHash) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        else {
            User.create({
                id: shortUUID.generate(),
                username: req.body.username,
                email: req.body.email,
                password: passwordHash
            })
            .then(user => {
                delete user.dataValues.id; // hide user id from client
                delete user.dataValues.password; // hide user password hash from client
                const token = jwt.sign({
                    username: user.username,
                    email: user.email
                }, process.env.JWT_KEY, { expiresIn: 1800 });
                res.status(201).json({
                    message: 'New user created',
                    data: {
                        user: user,
                        token: token
                    }
                });
            })
            .catch(err => {
                switch(err.name) {
                    case 'SequelizeUniqueConstraintError':
                        return res.status(400).json({ 
                            error: {
                                message: 'User already exist' 
                            }
                        });
                    case 'SequelizeDatabaseError':
                        return res.satus(400).json({ error: {
                            message: 'Missing fields' 
                        }
                    });
                    default:
                        return res.status(500).json({ error: err });
                }
            });
        }
    });
}

exports.login = (req, res, next) => {
    var identifier = {};
    if(req.body.username) identifier.username = req.body.username;
    else if(req.body.email) identifier.email = req.body.email;
    else {
        return res.status(401).json({
            error: { message: 'Auth failed' }
        });
    }

    User.findOne({
        where: identifier,
        attributes: ['password']
    })
    .then(user => {
        if(user) {     
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log(result);
                if(err) {
                    res.status(500).json({ error: err });
                }
                else if(!result) {
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
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}

exports.updateUser = (req, res, next) => {
    const username = req.query.user;
    
    User.findOne({
        where: {username: username},
        attributes: ['id', 'username', 'email', 'updatedAt']
    })
    .then(user => {
        if(user) {
            const updates = extractValidProperties(req.body, res);
            user.update(updates)
            .then(updatedUser => {
                delete updatedUser.dataValues.id; // hide id to client
                res.status(201).json({
                    message: 'User updated',
                    data: updatedUser
                });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            });
        }
        else {
            res.status(400).json({ message: 'Not found'});
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.deleteUser = (req, res, next) => {
    const username = req.query.user;

    User.delete({
        where: { username: username }
    })
    .then(data => {
        console.log(data);
        res.status(200).json({ message: `User deleted [${username}]` });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

function extractValidProperties(obj, res) {
    var updates = {};
    if(obj.username) {
        updates.username = obj.username;
    }
    if(obj.email) {
        updates.email = obj.email;
    }
    if(obj.password) {
        bcrypt.hash(obj.password, 8, (err, newPasswordHash) => {
            if(err) {
                return res.status(500).json({ error: err });
            }
            updates.password = newPasswordHash;         
        });
    }
    return updates;
}