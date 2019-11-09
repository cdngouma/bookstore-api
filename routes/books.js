const fetch = require('node-fetch');

const Book = require('../models/Book');
const router = (require('express')).Router();

// GET book by id
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const book = await Book.findById(id);
        if (book) {
            res.status(200).json(book);
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
    let attributes = null;
    if (req.params.preview) {
        attributes = 'id isbn10 isbn13 title author edition publisher publishedDate imageLink';
    }

    try {
        if (req.query.isbn) {
            const book = await findByIsbn(req.query.isbn, attributes);
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        } else {
            const books = findAll(req.query, attributes);
            if (books.length > 0) {
                res.status(200).json(books);
            } else {
                res.status(204).json({
                    message: 'No content'
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

// Filtered search
async function findAll (queries, attributes) {
    let params = {};
    if (queries.author) params.author = decodeURI(queries.author);
    if (queries.title) params.title = decodeURI(queries.title);
    if (queries.category) params.category = decodeURI(queries.category);
    if (queries.year) params.year = queries.year;

    try {
        const books = await Book.find(params, attributes);
        return books;
    } catch (err) {
        throw err;
    }
}

async function findByIsbn (isbn, attributes) {
    try {
        let book = await Book.findOne({
            $or: [{ isbn10: isbn }, { isbn13: isbn }]
        }, attributes);

        if (book) {
            return book;
        } else {
            // GET data from Google Books
            const URI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
            const response = await fetch(URI);
            const data = await response.json();
            if (data.items.length > 0) {
                return extractBookDetails(data.items[0]);
            } else {
                return null;
            }
        }
    } catch (err) {
        throw err;
    }
};

function extractBookDetails(data) {
    let isbn10 = null;
    let isbn13 = null; 
    for (o of data.volumeInfo.industryIdentifiers) {
        if (o.type === 'ISBN_10') isbn10 = o.identifier;
        else if (o.type === 'ISBN_13') isbn13 = o.identifier;
    }

    const imageLink = `http://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=0&edge=curl&source=gbs_api`;
    const publishedDate = new Date(data.volumeInfo.publishedDate);
    return {
        isbn10: isbn10,
        isbn13: isbn13,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors[0],
        edition: data.volumeInfo.edition,
        publisher: data.volumeInfo.publisher,
        publishedDate: publishedDate.getFullYear(),
        imageLink: imageLink
    }
}

module.exports = router;