const fetch = require('node-fetch');
const shortUUID = require('shortid');

const Merchant = require('../models/Merchant');
const User = require('../models/User');
const Book = require('../models/Book');

// Make a user a merchant
exports.becomeAMerchant = (req, res, next) => {
    const username = req.params.username;
    if(req.userData.username !== username){
        return res.status(401).json({ message: 'Access denied' });
    }

    User.verifyByUsername(username).then(rows => {
        if(rows > 0) {
            const newId = shortUUID.generate();
            const details = {
                id: newId,
                firstName: req.body.firstName,
                lastName: req.body.firstName,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                street: req.body.street,
                apt: req.body.apt,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                country: req.body.country
            }

            Merchant.insert(username, details).then(rows => {
                Merchant.findById(newId).then(rows => {
                    res.status(201).json({
                        message: 'New merchant created',
                        merchant: rows[0]
                    });
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            });
        }
        else {
            res.status(400).json({ message: 'Not found'});
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.advertiseNewProduct = (req, res, next) => {
    const username = req.params.username;
    if(req.userData.username !== username){
        return res.status(401).json({ message: 'Access denied' });
    }

    const isbn = req.body.isbn;
    // first check if book is in database
    // if no data available, fetch data from Google Books
    // then create new book, then create new product
    Book.query('SELECT id FROM Books WHERE isbn10=? OR isbn13=?', {isbn})
    .then(rows => {
        if(rows.length > 0){
            createProduct(req.body, rows[0].id, username);
        }
        else {
            const uri = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
            fetch(uri).then(response => response.json()).then(response => {
                if(response.totalItems > 0){
                    const newBook = extractBookDetails(response.items[0], isbn);
                    Book.insert(newBook).then(rows => {
                        createProduct(req.body, rows[0].id, username);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
                } else{
                    res.status(404).json({ message: 'Not Found' });
                }
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

function extractBookDetails(data, isbn){
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for(identifier of data.volumeInfo.industryIdentifiers){
        if(identifier.type === 'ISBN_10') {
            isbn10 = identifier.identifier;
        }
        else if(identifier.type === 'ISBN_13') {
            isbn13 = identifier.identifier;
        }
    }
    // set cover image path
    const newId = shortUUID.generate();
    const imageLink = `http://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=0&edge=curl&source=gbs_api`;
    return {
        id: newId,
        isbn10: isbn10,
        isbn13: isbn13,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors[0],
        publisher: data.volumeInfo.publisher,
        publishedDate: new Date(data.volumeInfo.publishedDate),
        edition: data.volumeInfo.edition || null,
        pageCount: data.volumeInfo.pageCount,
        category: data.volumeInfo.categories[0],
        language: data.volumeInfo.language,
        description: data.volumeInfo.description,
        imageLink: imageLink
    };
}

function createProduct(data, bookId, username){
    const newId = shortUUID.generate();
    const newProduct = {
        id: newId,
        bookId: bookId,
        username: username,
        price: data.price,
        quality: data.quality,
        width: data.width,
        length: data.height,
        thickness: data.thickness,
        weight: data.weight
    };

    // params: bookId, username, price, quality, width, height, thickness, weight 
    Product.insert(newProduct).then(rows => {
        Product.findById(newId).then(rows => {
            res.status(201).json({
                message: 'New product added',
                product: rows[0]
            });
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}