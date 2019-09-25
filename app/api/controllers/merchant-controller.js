const fetch = require('node-fetch');
const shortUUID = require('shortid');

const Merchant = require('../models/merchant');
const User = require('../models/user');
const Book = require('../models/book');
const Product = require('../models/product');

// Make a user a merchant
exports.becomeAMerchant = (req, res, next) => {
    const username = req.query.user;
    User.findOne({
        where: { username: username },
        attributes: ['id']
    })
    .then(user => {
        if(user) {
            Merchant.insert({
                id: shortUUID.generate(),
                userId: user.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                street: req.body.address.street,
                apt: req.body.address.apt,
                city: req.body.address.city,
                state: req.body.address.state,
                zipCode: req.body.address.zipCode,
                country: req.body.address.country
            })
            .then(newMerchant => {
                res.status(201).json({
                    message: 'New merchant created',
                    merchant: newMerchant
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

exports.advertiseNewProduct = (req, res, next) => {
    const username = req.params.username;
    const isbn = req.body.isbn;
    // first check if book is in database
    // if no data available, fetch data from Google Books
    // then create new book, then create new product
    Book.findOne({
        where: {
            [Op.or]: [
                {isbn10: isbn}, {isbn13: isbn}
            ]
        },
        attributes: ['id']
    })
    .then(book => {
        if(book){
            createProduct(req.body, book.id, userId);
        }
        else {
            const uri = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
            fetch(uri).then(response => response.json()).then(response => {
                if(response.totalItems > 0){
                    const details = extractBookDetails(response.items[0], isbn);
                    // set new id for book
                    details.id = shortUUID.generate();
                    Book.create(details)
                    .then(newBook => {
                        createProduct(req.body, newBook.id, userId);
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
    const imageLink = `http://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=0&edge=curl&source=gbs_api`;
    return {
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

function createProduct(data, bookId, userId){
    Product.create({
        id: shortUUID.generate(),
        bookId: bookId,
        userId: userId,
        price: data.price,
        quality: data.quality,
        width: data.width,
        length: data.height,
        thickness: data.thickness,
        weight: data.weight
    })
    .then(product => {
        res.status(201).json({
            message: 'New product added',
            data: product
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}