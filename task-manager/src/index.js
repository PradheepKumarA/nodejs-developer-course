const express = require('express');
require('./db/mongoose');
const userRouter = require('./router/users');
const tasksRouter = require('./router/tasks');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log('Server started at ', port);
})
