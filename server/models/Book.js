const db = require('../database/db');

class Book {
    constructor() { console.log('new instance of Book'); }

    query(SQL, params) {
        return db.query(SQL, (params || {}));
    }

    findById(bookId) {
        const SQL = 'SELECT id, isbn10, isbn13, author, title, publisher, published_date AS publishedDate, edition, page_count AS pageCount,' +
        'category, book_language AS `language`, book_desc AS `description`, image_link AS imageLink, created_at AS createdAt FROM Books WHERE id=?';
        return db.query(SQL, {bookId});
    }

    findByIsbn(isbn) {
        const SQL = 'SELECT id, isbn10, isbn13, author, title, publisher, published_date AS publishedDate, edition, page_count AS pageCount,' +
        'category, book_language AS `language`, book_desc AS `description`, image_link AS imageLink, created_at AS createdAt FROM Books WHERE isbn10=? OR isbn13=?';
        return db.query(SQL, {isbn});
    }

    insert(data) {
        const SQL = 'INSERT INTO Books(id,isbn10,isbn13,author,title,publisher,published_date,edition,page_count,category,book_language,book_desc,image_link) ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
        
        return db.query(SQL, data);
    }
}

module.exports = new Book();