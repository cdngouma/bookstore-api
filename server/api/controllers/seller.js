const fetch = require('node-fetch');
const Op = (require('sequelize')).Op;

const Seller = require('../models/seller');
const Address = require('../models/seller-address');
const User = require('../models/user');
const Book = require('../models/book');
const Product = require('../models/product');

// Make User a Book Seller
exports.becomeASeller = (req, res, next) => {
    const user_id = req.params.user_id;
    User.findOne({
        where: { id: user_id },
        attributes: ['id']
    }).then(user => {
        if (user) {
            return Seller.create({
                userId: user.id,
                address: {
                    line1: req.body.address.line1,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    country: req.body.address.country,
                    zipCode: req.body.address.zipCode
                }
            }, {
                include: [Address]
            });
        }
        else {
            res.status(400).json({
                message: 'Not found'
            });
        }
    }).then(newMerchant => {
        res.status(201).json({
            message: 'New merchant created',
            data: newMerchant
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.addNewProduct = (req, res, next) => {
    const user_id = req.params.user_id;
    const data = req.body;
    // Search the book and check if the user is a seller
    Promise.all([
        Seller.findOne({
            where: {
                userId: user_id
            },
            attributes: ['id']
        }),
        Book.findOne({
            where: {
                [Op.or]: [
                    { isbn10: data.isbn },
                    { isbn13: data.isbn }
                ]
            },
            attributes: ['id']
        })
    ]).then(values => {
        const seller = values[0];
        const book = values[1];

        if (!seller) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        if (book) {
            return Product.create({
                bookId: book.id,
                sellerId: seller.id,
                price: data.price,
                quality: data.quality,
                inStock: data.inStock
            });
        }
        // If the book is not in the database, fetch data from Google Books
        else {
            const URI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`;
            return fetch(URI).then(response => response.json()).then(response => {
                if (response.totalItems) {
                    const details = extractBookDetails(response.items[0], data.isbn);
                    return Book.create(details);
                } else {
                    res.status(404).json({
                        message: 'Not Found'
                    });
                }
            }).then(newBook => {
                return Product.create({
                    bookId: newBook.id,
                    sellerId: seller.id,
                    price: data.price,
                    quality: data.quality,
                    inStock: data.inStock
                });
            });
        }
    }).then(product => {
        res.status(201).json({
            message: 'New product added',
            data: product
        });
    }).catch(err => {
        //console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

function extractBookDetails(data, isbn) {
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for (identifier of data.volumeInfo.industryIdentifiers) {
        if (identifier.type === 'ISBN_10') {
            isbn10 = identifier.identifier;
        }
        else if (identifier.type === 'ISBN_13') {
            isbn13 = identifier.identifier;
        }
    }
    // set cover image path
    const imageLink = `http://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=0&edge=curl&source=gbs_api`;
    const publishedDate = new Date(data.volumeInfo.publishedDate);
    return {
        isbn10: isbn10,
        isbn13: isbn13,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors[0],
        category: data.volumeInfo.categories[0],
        edition: data.volumeInfo.edition || null,
        publisher: data.volumeInfo.publisher,
        year: publishedDate.getFullYear(),
        pageCount: data.volumeInfo.pageCount,
        language: data.volumeInfo.language,
        description: data.volumeInfo.description,
        imageLink: imageLink
    };
}