const express = require('express');
const Users = require('../models/users');
const auth = require('../middleware/authentication');

const router = express.Router();


//login and logout
router.post('/users/login', async (req, res) => {
    try {
        const user = await Users.findByCredentails(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        const tokens = req.user.tokens.filter(token => token.token !== req.token);
        req.user.tokens = tokens;
        await req.user.save();
        res.send('logged out!');
    } catch (e) {
        res.status(400).send('Error occured!', e);
    }
});
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('logged out!');
    } catch (e) {
        res.status(400).send('Error occured!', e);
    }
});


// CRUDS on /users
router.post('/users', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/users/:id', auth, async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user) {
            res.status(404).send('could not find the user');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.patch('/users/me', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const validKeys = ['name', 'email', 'password', 'age'];
    const isValidKeys = keys.every(key => validKeys.includes(key));
    if (!isValidKeys) {
        res.status(400).send('invalid input');
    }
    try {
        const user = req.user;
        keys.forEach(key => user[key] = req.body[key]);
        await user.save();
        if (!user) {
            res.status(404).send('could not find the user');
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;
