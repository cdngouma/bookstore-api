const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    author: { type: String, required: true },
    details: {
        isbn: { type: Number, required: true, unique: true },
        publisher: { type: String, required: true },
        publicationYear: { type: Number, required: true },
        edition: { type: String, required: true },
        numPages: { type: Number, required: true },
        language: { type: String, required: false },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        length: { type: Number, required: true },
        weight: { type: Number, required: false }
    },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    coverImage: { type: String, required: false }
});

module.exports = mongoose.model('Book', bookSchema);