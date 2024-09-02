import React, { useState, useEffect } from 'react';

const TaskList = ({ courseId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/courses/${courseId}/tasks`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          alert(`Failed to fetch tasks: ${response.statusText}`);
        }
      } catch (error) {
        alert('An error occurred while fetching tasks. Please try again later.');
        console.error('Error:', error);
      }
    };

    if (courseId) {
      fetchTasks();
    }
  }, [courseId]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Task Completed!');
        // Update the task list after deletion
        setTasks(tasks.filter(task => task._id !== taskId));
      } else {
        alert(`Failed to delete task: ${response.statusText}`);
      }
    } catch (error) {
      alert('An error occurred while deleting the task. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Tasks for Course: {courseId}</h3>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.taskName}</strong> - Due: {new Date(task.dueDate).toLocaleDateString()}
              <p>{task.details}</p>
              <button onClick={() => handleDelete(task._id)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                Mark as Completed
              </button>
            </li>
          ))
        ) : (
          <p>No tasks found for this course.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
