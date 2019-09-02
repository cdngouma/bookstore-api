const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    orderDate: {type: Date, required: true, default: new Date()},
    returnDate: {type: Date, required: true},
    returned: {type: Boolean, required: true, default: false}
});

module.exports = orderSchema;