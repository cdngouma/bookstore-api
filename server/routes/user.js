const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/signup', (req, res, next) => {
    
    bcrypt.hash(req.body.password, 8, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const params = [
                req.body.username,
                req.body.email,
                hash, // password
                req.body.firstName,
                req.body.lastName
            ];
            
            const SQL = 'INSERT INTO Users(username,email,`password`,first_name,last_name) VALUES(?,?,?,?,?)';

            db.query(SQL, params).then(rows => {
                console.log(rows);
                res.status(201).json({
                    message: 'user created'
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    const SQL = 'SELECT `password`, first_name AS firstName, last_name AS lastName FROM Users WHERE username = ?';

    db.query(SQL, [req.body.username])
    .then(rows => {
        if(rows.length > 0){
            const {password} = rows[0];
            const {firstName} = rows[0];
            const {lastName} = rows[0];
            
            bcrypt.compare(req.body.password, password, (err, result) => {
                if(err){
                    res.status(500).json({
                        error: err
                    });
                }
                else if(!result){
                    res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                else{
                    const JWT_KEY = 'encrypt';
                    const token = jwt.sign({
                        username: req.body.username,
                        firstName: firstName,
                        lastName: lastName
                    }, JWT_KEY,{ expiresIn: "1h" });

                    res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
            });
        } else {
            res.status(401).json({
                message: 'Auth failed'
            });
        }
    });
});

router.get('/:username/info', (req, res, next) => {
    const username = req.params.username;
    const SQL = 'SELECT first_name AS firstName, last_name AS lastName FROM Users WHERE username = ?';

    db.query(SQL, [username]).then(rows => {
        if(rows.length > 0){
            res.status(200).json({
                data: rows
            });
        }
        else{
            res.status(404).json({
                message: 'Not Found'
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;