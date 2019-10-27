const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    isMercahnt: {
        type: Boolean,
        required: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    joinedOn: {
        type: Date,
    },
    credentials: {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    personalInfo: {
        retailName: {
            type: String,
            trim: true,
            required: () => {
                return this.firstName && this.lastName ? false : true;
            }
        },
        firstName: {
            type: String,
            trim: true,
            required: () => {
                return this.retailName ? false : true;
            }
        },
        lastName: {
            type: String,
            trim: true,
            required: () => {
                return this.retailName ? false : true;
            }
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            trim: true
        }
    },
    connectInfo: {
        tel: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                trim: true,
                required: true
            },
            country: {
                type: String,
                required: true,
                trim: true
            },
            zipCode: {
                type: Number,
                required: true,
                trim: true
            }
        }
    }
});

UserSchema.plugin(timestamp);

const User = mongoose.model('Book', UserSchema);
module.exports = User;