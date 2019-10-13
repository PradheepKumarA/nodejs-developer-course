const express = require('express');
const Tasks = require('../models/tasks');
const auth = require('../middleware/authentication');

const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Tasks({
            ...req.body,
            owner: req.user._id
        });
        await task.save()
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            oprions: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send('Task not found')
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.patch('/tasks/:id', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const validKeys = ['name', 'description', 'completed'];
    const isValidKeys = keys.every(key => validKeys.includes(key));
    if (!isValidKeys) {
        res.status(400).send('invalid input');
    }
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
        keys.forEach(key => task[key] = req.body[key]);
        await task.save();
        if (!task) {
            res.status(404).send('could not find the task');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send('Couldn\'t find the task');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;
