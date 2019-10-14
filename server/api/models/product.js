const Sequelize = require('sequelize');
const shortUUID = require('shortid');
const sequelize = require('../../config/database');

const Book = require('./book');
const Seller = require('./seller');

class Product extends Sequelize.Model {}

Product.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: shortUUID.generate(),
        field: 'product_id'
    },
    bookId: {
        type: Sequelize.STRING,
        field: 'book_id',
        allowNull: false,
        references: {
            model: Book,
            key: 'id'
        }
    },
    sellerId: {
        type: Sequelize.STRING,
        field: 'seller_id',
        allowNull: false,
        references: {
            model: Seller,
            key: 'id'
        }
    },
    price: { type: Sequelize.DOUBLE, allowNull: false },
    quality: { type: Sequelize.STRING, allowNull: false },
    inStock: { type: Sequelize.STRING, allowNull: false, field: 'in_stock' },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'created_at' }
}, {
    sequelize,
    timestamps: false,
    modelName: 'product',
    tableName: 'products',
    freezeTableName: true
});

Product.hasOne(Seller);
Product.hasOne(Book);

module.exports = Product;