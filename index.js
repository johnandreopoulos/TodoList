const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

let tasks = [];

// Load tasks from file
fs.readFile('./data/tasks.json', 'utf8', (err, data) => {
    if (err) {
        if (err.code === 'ENOENT') {
            fs.mkdir('./data', (err) => {
                if (err) console.error(err);
            });
            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
                if (err) console.error(err);
            });
        } else {
            console.error(err);
        }
    } else {
        tasks = JSON.parse(data);
    }
});

// Save tasks to file
function saveTasks() {
    fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
        if (err) console.error(err);
    });
}

// Get all tasks
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const task = req.body;
    task.id = tasks.length + 1;
    task.completed = false;
    tasks.push(task);
    saveTasks();
    res.status(201).json(task);
});

// Update a task
app.patch('/tasks/:id', (req, res) => {
    console.log(req.body);
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex >= 0) {
        const task = tasks[taskIndex];
        task.name = req.body.name;
        task.completed = req.body.completed;
        saveTasks();
        res.status(200).json(task);
    }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex >= 0) {
        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        saveTasks();
        res.status(200).json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});