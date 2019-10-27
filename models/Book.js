const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BookSchema = new mongoose.Schema({
    isbn10: {
        type: String,
        required: () => {
            return isbn13 ? false : true;
        }
    },
    isbn13: {
        type: String,
        required: () => {
            return isbn10 ? false : true;
        }
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    maturityLevel: {
        type: String,
        trim: true
    },
    edition: {
        type: String,
        required: true,
        trim: true
    },
    publisher: {
        type: String,
        required: true,
        trim: true
    },
    publishedDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageLink: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

BookSchema.plugin(timestamp);

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;