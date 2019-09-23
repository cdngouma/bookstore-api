const db = require('../database/db');

class Merchant {
    constructor() { console.log('new instance of Merchant') }

    query(query, params) {
        return db.query(query, (params || {}));
    }

    findById(merchantId) {
        const SQL = 'SELECT Users.username, first_name AS firstName, last_name AS lastName, date_of_birth AS dateOfBirth, gender, street, ' +
            'apt, city, zip_code AS zipCode, country, created_at AS createdAt JOIN Users ON Merchants.user_id=Users.id WHERE Users.id = ?';
        return db.query(SQL, {merchantId});
    }

    insert(username, data) {
        const SQL = 'INSERT INTO Merchants(id,user_id,first_name,last_name,date_of_birth,gender,street,apt,city,state,zip_code,country) ' +
            'VALUES(?,(SELECT id FROM Users WHERE username = ?),?,?,?,?,?,?,?,?,?,?)';;
        return db.query(SQL);
    }
}

module.exports = new Merchant();