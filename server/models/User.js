const db = require('../database/db');

class User {
    constructor() { console.log('new instance of User.js'); }

    query(query, params) {
        return db.query(query, (params));
    }

    insert(data) {
        const SQL = 'INSERT INTO Users(id, username, user_email, user_password) VALUES(?, ?, ?, ?)';
        return db.query(SQL, {id: data.id, username: data.username, email: data.email, password: data.password});
    }

    update(data) {
        const SQL = 'UPDATE Users SET username=COALESCE(?, username), user_email=COALESCE(?, user_email), user_password=COALESCE(?, user_password) WHERE username = ?';
        return db.query(SQL, { newUsername: data.username, email: data.email, password: data.password, username: data.username });
    }

    delete(username) {
        const SQL = 'DELETE FROM Users WHRE username = ?';
        return db.query(SQL, {username});
    }

    verifyByUsername(username) {
        const SQL = 'SELECT 1 FROM Users WHERE username = ?';
        return db.query(SQL, {username});
    }
}

module.exports = new User();