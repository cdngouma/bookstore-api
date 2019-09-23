const mysql = require('mysql');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'bookstore',
            connectionLimit: 10,
            connectTimeout: 60000,
            supportBigNumbers: true
        });
    }

    query(sql, object) {
        object = object || {};
        const args = Object.values(object);
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
console.log('------- new instance of DB created');
module.exports = new Database();