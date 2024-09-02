import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded }) => {
  const [courseId, setCourseId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const taskData = {
      courseId,
      taskName,
      dueDate,
      details,
    };

    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        alert('Task added successfully!');
        onTaskAdded();
        setCourseId('');
        setTaskName('');
        setDueDate('');
        setDetails('');
      } else {
        // Handle server response errors
        alert(`Failed to add task: ${response.statusText}`);
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      alert('An error occurred while adding the task. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <textarea
        placeholder="Additional Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
