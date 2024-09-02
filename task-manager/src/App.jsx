import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [courseId, setCourseId] = useState('');

  const handleTaskAdded = () => {
    setCourseId(courseId);
  };

  return (
    <div className="App">
      <h1>Course Task Manager</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <div className="course-id-input">
        <input
          type="text"
          placeholder="Enter Course ID to view tasks"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
      </div>
      <TaskList courseId={courseId} />
    </div>
  );
}

export default App;

