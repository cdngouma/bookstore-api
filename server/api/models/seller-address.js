const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Seller = require('./seller');

class SellerAddress extends Sequelize.Model {}

SellerAddress.init({
    sellerId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_id',
        references: {
            model: Seller,
            key: 'id'
        }
    },
    line1: { type: Sequelize.STRING, allowNull: false },
    city: { type: Sequelize.STRING, allowNull: false },
    state: Sequelize.STRING,
    country: { type: Sequelize.STRING, allowNull: false },
    zipCode: Sequelize.STRING,
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'updated_at' }
},
{
    sequelize,
    timestamps: false,
    modelName: 'merchantAddress',
    tableName: 'merchants_addresses',
    freezeTableName: true
});
// removes generic 'id' column
SellerAddress.removeAttribute('id');

Seller.hasOne(SellerAddress);

module.exports = SellerAddress;