const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    rateValue: {type: Number, min: 1, max: 5, required: true},
    date: {type: Date, required: true, default: new Date()}
});

module.exports = mongoose.model('Book', rateSchema);