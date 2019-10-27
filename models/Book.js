const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BookSchema = new mongoose.Schema({
    isbn10: {
        type: String,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10,
        required: () => {
            return isbn13 ? false : true;
        }
    },
    isbn13: {
        type: String,
        unique: true,
        trim: true,
        minlength: 13,
        maxlength: 13,
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
    maturityRating: {
        type: String,
        trim: true
    },
    edition: {
        type: Number
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
        min: 1,
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