const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const db = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const checkAuth = require('../auth/check-auth');

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
                req.body.lastName,
                new Date(req.body.dateOfBirth),
                req.body.gender,
                req.body.address.street,
                req.body.address.apt,
                req.body.address.city,
                req.body.address.state,
                req.body.address.zip,
                req.body.address.country,
                req.body.profileImage,
                req.body.isSeller
            ];
            
            const SQL = 'INSERT INTO Users(username, email, `password`, first_name, last_name, date_of_birth, gender,' +
                'street_address, apt,city, state, zip, country, profile_img, is_seller) ' +
                'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

            db.query(SQL, params).then(rows => {
                res.status(201).json({
                    message: 'user created',
                    user: {
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    }
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

router.get('/:username', (req, res, next) => {
    const username = req.params.username;
    db.query('SELECT username, city, state, zip, country FROM UserInfo WHERE username = ?', [username])
    .then(rows => {
        if(rows.length > 0){
            const data = rows[0];
            res.status(200).json({
                username: username,
                location: {
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                    country: data.country
                }
            });
        }
        else{
            res.status(404).json({ message: 'Not Found' });
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
});

router.get('/:username/info', checkAuth, (req, res, next) => {
    const username = req.params.username;
    const SQL = 'SELECT first_name AS firstName, last_name AS lastName, date_of_birth AS dateOfBirth, gender, street_address AS street, ' + 
        'apt, city, state, zip, country, profile_img AS profileImage, is_seller AS isSeller FROM UserInfo WHERE username = ?';

    db.query(SQL, [username]).then(rows => {
        if(rows.length > 0){
            const data = rows[0];
            res.status(200).json({
                data: {
                    username: username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                    address: {
                        street: data.street,
                        apt: data.apt,
                        state: data.state,
                        zip: data.zip,
                        country: data.country
                    },
                    profileImage: data.profileImage,
                    isSeller: data.isSeller
                }
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

// create new book post
router.post('/:username/posts', checkAuth, (req, res, next) => {
    const username = req.params.username;
    if(req.userData.username !== username){
        res.status(401).json({
            message: 'Access denied'
        });
        return;
    }

    const isbn = req.body.isbn;
    // check if book is in database
    db.query('SELECT id FROM Books WHERE isbn10='+isbn+' OR isbn13='+isbn)
    .then(rows => {
        // if found, add new product
        if(rows.length > 0){
            createProduct(req.body, rows[0].id, username);
        }
        // if not found,
        else {
            // fetch data from google
            const uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
            
            fetch(uri).then(response => response.json()).then(response => {
                if(response.totalItems > 0){
                    // extract book data
                    const details = extractBookDetails(response.items[0].volumeInfo, isbn);
                    // create new book
                    // params: isbn10, isbn13,title, author, publisher, publishedDate, edition, pageCount, category, language, description, cover
                    db.query('CALL CREATE_BOOK(?,?,?,?,?,?,?,?,?,?,?,?)', details)
                    .then(rows => {
                        createProduct(req.body, rows[0].id, username);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
                } else{
                    res.status(404).json({ message: 'Not Found' });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

function extractBookDetails(data, isbn){
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for(o of data.industryIdentifiers){
        if(o.type === 'ISBN_10') isbn10 = o.identifier;
        else if(o.type === 'ISBN_13') isbn13 = o.identifier;
    }

    return [
        isbn10,
        isbn13,
        data.title,
        data.authors[0],
        data.publisher,
        new Date(data.publishedDate),
        data.edition || null,
        data.pageCount,
        data.categories[0],
        data.language,
        data.description,
        data.imageLinks.thumbnail
    ];
}

function createProduct(data, bookId, username){
    const details = [
        bookId,
        username,
        data.price,
        data.quality,
        data.width,
        data.height,
        data.thickness,
        data.weight
    ];

    console.log('new product', details);

    // params: bookId, username, price, quality, width, height, thickness, weight 
    db.query('CALL CREATE_PRODUCT(?,?,?,?,?,?,?,?)', details)
    .then(rows => {
        res.status(201).json({
            message: 'Product added',
            data: rows[0]
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}

module.exports = router;