const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./tasks');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, {
        timestamps: true
    });

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.tokens;
    delete user.password;
    delete user.__v;
    return user;
}

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'jwtsalt');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentails = async (email, password) => {
    const user = await Users.findOne({ email });
    if (!user) {
        throw new Error('login failed');
    }

    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('login failed');
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove', async function (next) {
    const user = this;
    await Tasks.deleteMany({ owner: user._id });
    next();
})

const Users = new mongoose.model('Users', userSchema);

module.exports = Users;
