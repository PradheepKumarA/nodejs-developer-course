const mongoose = require('mongoose');
const validator = require('validator');


const Users = new mongoose.model('Users', {
    name: {
        required: true,
        trim: true,
        type: String
    },
    email_id: {
        required: true,
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Enter proper email');
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.includes('password')) {
                throw Error('password cannot be password')
            }
        }
    },
    age: {
        default: 25,
        type: Number
    }
});

module.exports = Users;
