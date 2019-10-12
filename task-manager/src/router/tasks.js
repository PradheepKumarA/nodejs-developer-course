const express = require('express');
const Tasks = require('../models/tasks');

const router = express.Router();

router.post('/tasks', async (req, res) => {
    try {
        const task = new Tasks(req.body);
        await task.save()
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Tasks.find();
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id)
        if (!task) {
            res.status(404).send('Task not found')
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.patch('/tasks/:id', async (req, res) => {
    const keys = Object.keys(req.body);
    const validKeys = ['name', 'description', 'completed'];
    const isValidKeys = keys.every(key => validKeys.includes(key));
    if (!isValidKeys) {
        res.status(400).send('invalid input');
    }
    try {
        const task = await Tasks.findByIdAndUpdate(req.params.id, res.body, { new: true, runValidators: true });
        if (!task) {
            res.status(404).send('could not find the task');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.body.id);
        if (!task) {
            res.status(404).send('Couldn\'t find the task');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;
