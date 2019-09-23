const db = require('../database/db');

class Product {
    constructor() { console.log('new instance of Product') }

    query(query, params) {
        return db.query(query, (params || {}));
    }

    findById(productId) {
        const SQL = 'SELECT Products.id, Books.id AS bookId, title, author, Users.username AS merchant, price, quality, print_type AS printType, ' +
            'width, `length`, thickness, weight, created_at AS createdAt FROM Products JOIN Merchants ON Products.merchant_id=Merchants.id ' + 
            'JOIN Users ON Merchants.user_id=Users.id JOIN Books ON Proucts.book_id=Books.id WHERE Products.id = ?';
        return db.query(SQL, {productId});
    }

    findByMerchant(merchantUsername) {
        const SQL = 'SELECT Products.id, Books.id AS bookId, title, author, Users.username AS merchant, price, quality, print_type AS printType, ' +
            'width, `length`, thickness, weight, created_at AS createdAt FROM Products JOIN Merchants ON Products.merchant_id=Merchants.id ' + 
            'JOIN Users ON Merchants.user_id=Users.id JOIN Books ON Proucts.book_id=Books.id WHERE Users.username = ?';
        return db.query(SQL, {merchantUsername});
    }

    findByBookTitleAndAuthor(bookTitle) {
        const SQL = 'SELECT Products.id, Books.id AS bookId, title, author, Users.username AS merchant, price, quality, print_type AS printType, ' +
            'width, `length`, thickness, weight, created_at AS createdAt FROM Products JOIN Merchants ON Products.merchant_id=Merchants.id ' + 
            'JOIN Users ON Merchants.user_id=Users.id JOIN Books ON Proucts.book_id=Books.id WHERE Books.title = ?';
        return db.query(SQL, {bookTitle});
    }

    findByBookId(bookId) {
        const SQL = 'SELECT Products.id, Books.id AS bookId, title, author, Users.username AS merchant, price, quality, print_type AS printType, ' +
            'width, `length`, thickness, weight, created_at AS createdAt FROM Products JOIN Merchants ON Products.merchant_id=Merchants.id ' + 
            'JOIN Users ON Merchants.user_id=Users.id JOIN Books ON Proucts.book_id=Books.id WHERE Books.id = ?';
        return db.query(SQL, {bookId});
    }

    insert(data) {
        const SQL = 'INSERT INTO Merchants(id,book_id,merchant_id,price,quality,print_type,width,length,thickness,weight) VALUES(?,?,?,?,?,?,?,?,?,?)';
        return db.query(SQL);
    }

    update(productId, data) {

    }

    delete(productId) {
        const SQL = 'DELETE FROM Products WHERE id = ?';
        return db.query(SQL, {productId});
    }
}

module.exports = new Product();