const express = require('express');
const Users = require('../models/users');

const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    const keys = Object.keys(req.body);
    const validKeys = ['name', 'email_id', 'password', 'age'];
    const isValidKeys = keys.every(key => validKeys.includes(key));
    if (!isValidKeys) {
        res.status(400).send('invalid input');
    }
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, res.body, { new: true, runValidators: true });
        if (!user) {
            res.status(404).send('could not find the user');
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.body.id);
        if (!user) {
            res.status(404).send('Couldn\'t find the user');
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;
