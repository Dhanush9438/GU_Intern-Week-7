const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use(cors());
app.use(bodyParser.json());

// Define Task Schema
const taskSchema = new mongoose.Schema({
    courseId: String,
    taskName: String,
    dueDate: Date,
    details: String
});

// Define Task Model
const Task = mongoose.model('Task', taskSchema);

// Route to retrieve tasks for a specific course
app.get('/courses/:courseId/tasks', async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log(`Fetching tasks for course ID: ${courseId}`);

        const tasks = await Task.find({ courseId });

        if (tasks.length === 0) {
            console.log(`No tasks found for course ID: ${courseId}`);
            return res.status(404).json({ message: 'No tasks found for this course.' });
        }

        console.log(`Found ${tasks.length} task(s) for course ID: ${courseId}`);
        res.json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Route to add a task
app.post('/tasks', async (req, res) => {
    const { courseId, taskName, dueDate, details } = req.body;
    console.log(`Adding new task for course ID: ${courseId}`);

    const newTask = new Task({
        courseId,
        taskName,
        dueDate,
        details
    });

    try {
        await newTask.save();
        console.log(`Task added successfully for course ID: ${courseId}`);
        res.status(201).json({ message: 'Task added successfully.' });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Failed to add task.' });
    }
});

// Route to delete a task
app.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    console.log(`Attempting to delete task with ID: ${taskId}`);

    try {
        const result = await Task.findByIdAndDelete(taskId);
        if (result) {
            console.log(`Task with ID: ${taskId} deleted successfully`);
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            console.log(`Task with ID: ${taskId} not found`);
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
