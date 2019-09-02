//const Sequelize = require('sequelize');
const Sequelize = require('../config/database');

const Book = Sequelize.define('book', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{
        type: Sequelize.STRING, 
        allowNull: false
    },
    author: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    isbn: { 
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    publisher: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publicationYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'year'
    },
    edition: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pages: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    language: {
        type: Sequelize.STRING
    },
    width: {
        type: Sequelize.FLOAT
    },
    height: {
        type: Sequelize.FLOAT
    },
    length: {
        type: Sequelize.FLOAT
    },
    weight: {
        type: Sequelize.FLOAT
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        field: 'desc'
    },
    cover: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
    }
});

module.exports = Book;