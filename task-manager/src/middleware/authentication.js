const jwt = require('jsonwebtoken');
const Users = require('../models/users');


const validate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = await jwt.decode(token, 'jwtsalt');
        const id = decoded._id;
        const user = await Users.findOne({ _id: id, 'tokens.token': token });

        if (!user) {
            res.status(404).send('Please Authenticate')
        }

        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        res.status(404).send('Please Authenticate')
    }
}


module.exports = validate;
