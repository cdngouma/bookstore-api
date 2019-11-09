const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const Credentials = new mongoose.Schema({
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
        unique: true,
        validate: {
            validator: (v) => {
                return '^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$'.test(v);
            },
            message: 'Email validation failed'
        }
    },
    password: {
        type: String,
        required: true
    }
}, { _id: false });

const PersonalInfo = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: () => {
            return this ? true : false
        }
    },
    dateOfBirth: {
        type: Date,
        required: () => {
            return this ? true : false
        }
    },
    gender: {
        type: String,
        trim: true
    }
}, { _id: false });

const ConnectInfo = mongoose.Schema({
    tel: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return '^(?:(\+|00)[1-9]{1,3}\ ?)(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$'.test(v);
            },
            message: 'Phone number validation failed'
        }
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true/*,
            validate: {
                validator: (v) => {
                    return ''.test(v);
                }
            }*/
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 2,
            required: () => {
                return this.province ? false : true
            }
        },
        province: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 2,
            required: () => {
                return this.state ? false : true
            }
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
}, { _id: false });

const UserSchema = new mongoose.Schema({
    isSeller: {
        type: Boolean,
        required: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    joinedAt: {
        type: Date,
    },
    leftAt: {
        type: Date,
    },
    retailerName: {
        type: String,
        trim: true,
        required: () => {
            this.personalInfo ? false : true;
        }
    },
    credentials: {
        type: Credentials,
        required: true
    },
    personalInfo: {
        type: PersonalInfo,
        required: () => {
            this.retailerName ? false : true;
        }
    },
    connectInfo: {
        type: ConnectInfo,
        required: () => {
            return this.isSeller ? true : false;
        }
    }
});

//UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);
module.exports = User;