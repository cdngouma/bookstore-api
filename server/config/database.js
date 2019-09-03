const mysql = require('mysql');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'book-rental',
            connectionLimit: 10,
            connectTimeout: 60000,
            supportBigNumbers: true
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                console.log(rows);
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