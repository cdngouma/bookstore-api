const User = require('../models/User');
const Book = require('../models/Book');
const Product = require('../models/Product');
const router = (require('express')).Router();

router.post('/join', async (req, res, next) => {
    const data = req.body;
    const userId = req.query.id;
    try {
        // check if user exist
        const user = await User.findByIdAndUpdate(userId, {
            isSeller: true,
            isVerified: true,
            joinedOn: new Date(),
            connectInfo: {
                tel: data.connectInfo.tel,
                address: {
                    street: data.connectInfo.address.street,
                    state: data.connectInfo.address.state,
                    country: data.connectInfo.address.country,
                    zipCode: data.connectInfo.address.zipCode
                }
            }
        });

        if (user) {
            res.status(201).json({
                message: 'User joined the sellers community',
                data: user
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

router.post('/remove/:id', async (req, res, next) => {
    const userId = req.params.id;
    try {
        // check if user exist
        const user = await User.findByIdAndUpdate({ _id: userId, isSeller: true }, {
            isSeller: false,
            leftOn: new Date()
        });

        if (user) {
            res.status(201).json({
                message: 'User was removed from the sellers community',
                data: user
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

router.get('/', async (req, res, next) => {
    let filters = { isSeller: true };
    if (req.query.verified != undefined) {
        filters.isVerified = req.query.verified;
    }

    try {
        const attributes = '_id isVerified joinedOn credentials.username retailerName connectInfo.address.city connectInfo.address.state connectInfo.address.country';
        const sellers = await User.find(filters, attributes);
        if (sellers.length > 0) {
            res.status(200).json({
                numItems: sellers.length,
                items: sellers
            });
        } else {
            res.status(204).json({
                message: 'No content'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const attributes = '_id isVerified joinedOn credentials.username retailerName connectInfo';
        const id = req.params.id;
        const seller = await User.find(id, attributes);
        if (seller) {
            res.status(200).json({
                seller
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

router.post('/:id/products', async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const seller = await User.findById({ _id: id, isSeller: true }, '_id');
        if (seller) {
            const bookId = await Book.find({
                $eq: {
                    isbn10: data.isbn,
                    isbn13: data.isbn
                }
            }, '_id');

            if (bookId.length > 0) {
                const newProduct = await Product.create({
                    sellerId: seller._id,
                    bookId: book._id,
                    price: data.price,
                    quality: data.quality,
                    status: data.status
                });

                res.status(201).json({
                    message: 'New product created',
                    item: newProduct
                });
            } else {
                const URI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`;
                const response = await fetch(URI);
                const rawData = await response.json();
                if (rawData.items.length > 0) {
                    const bookData = extractBookDetails(rawData.items[0]);
                    const newBook = await Book.create(bookData);
                    const newProduct = await Product.create({
                        sellerId: seller._id,
                        bookId: newBook._id,
                        price: data.price,
                        quality: data.quality,
                        status: data.status
                    });

                    res.status(201).json({
                        message: 'New product created',
                        item: newProduct
                    });
                } else {
                    res.status(404).json({
                        message: 'Not found'
                    });
                }
            }
        } else {
            res.status(401).json({
                message: 'Denied'
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});

function extractBookDetails(data, isbn) {
    // extract ISBN codes
    let isbn10 = null;
    let isbn13 = null;
    for (o of data.volumeInfo.industryIdentifiers) {
        if (o.type === 'ISBN_10') isbn10 = o.identifier;
        else if (o.type === 'ISBN_13') isbn13 = o.identifier;
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
        maturityRating: data.volumeInfo.maturityRating,
        edition: data.volumeInfo.edition,
        publisher: data.volumeInfo.publisher,
        publishedDate: publishedDate.getFullYear(),
        pageCount: data.volumeInfo.pageCount,
        language: data.volumeInfo.language,
        description: data.volumeInfo.description,
        imageLink: imageLink
    };
}

module.exports = router;