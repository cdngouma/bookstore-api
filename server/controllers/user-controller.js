const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shortUUID = require('shortid');

const User = require('../models/User');

// create new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 8, (err, passwordHash) => {
        if(err) return res.status(500).json({ error: err }); 
        else {
            const newUser = {
                id: shortUUID.generate(),
                username: req.body.username,
                email: req.body.email || null,
                password: passwordHash
            };

            User.save(newUser).then(rows => {
                res.status(201).json({
                    message: 'New user created',
                    user: { username: req.body.username }
                });
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }
    });
}

exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.query('SELECT user_password AS password FROM Users WHERE username = ?', {username})
    .then(rows => {
        if(rows.length > 0){           
            bcrypt.compare(password, rows[0].password, (err, result) => {
                if(err) res.status(500).json({ error: err })
                else if(!result) res.status(401).json({ message: 'Authentification failed' })
                else {
                    const token = jwt.sign({ username: username }, process.env.JWT_KEY, { expiresIn: "1h" });
                    res.status(200).json({
                        message: 'Authentification successful',
                        token: token
                    });
                }
            });
        }
        else res.status(401).json({ message: 'Authentification failed' });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.updateUser = (req, res, next) => {
    const username = req.query.user;
    if(req.userData.username !== username) {
        return res.status(401).json({ message: 'Access denied' });
    }
    
    // check if User exist
    User.verifyByUsername(username).then(rows => {
        if(rows.length > 0 && req.body.password) {
            bcrypt.hash(req.body.password, 8, (err, newPasswordHash) => {
                if(err) return res.status(500).json({ error: err }); 
                else update(req, res, newPasswordHash);
            });
        }
        else if(rows.length > 0) {
            update(req, res, null);
        }
        else {
            res.status(400).json({ message: 'Not found'});
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.deleteUser = (req, res, next) => {
    const username = req.query.user;
    if(req.userData.username !== username) {
        return res.status(401).json({ message: 'Access denied' });
    }

    User.delete(username).then(rows => {
        res.status(200).json({ message: `User deleted [${username}]` });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

function update(req, res, newPasswordHash) {
    User.update({ 
        username: req.body.username, 
        email: req.body.email, 
        password: newPasswordHash
    })
    .then(rows => {
        res.status(201).json({
            message: 'User updated',
            username: req.query.user
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}