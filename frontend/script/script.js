// Add Event Listener for the Add Task Form
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskData = {
        courseId: document.getElementById('courseId').value,
        taskName: document.getElementById('taskName').value,
        dueDate: document.getElementById('dueDate').value,
        details: document.getElementById('details').value
    };

    fetch('https://gu-intern-week-7.onrender.com/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Task added successfully!');
        document.getElementById('taskForm').reset(); // Clear the form
    })
    .catch(error => {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    });
});

// Add Event Listener for the Retrieve Tasks Form
document.getElementById('retrieveForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const courseId = document.getElementById('retrieveCourseId').value;

    try {
        const response = await fetch(`https://gu-intern-week-7.onrender.com/courses/${courseId}/tasks`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No tasks found for this course');
        }
        
        const tasks = await response.json();
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = ''; // Clear any previous tasks

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <h3>${task.taskName}</h3>
                    <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                    <p><strong>Details:</strong> ${task.details}</p>
                    <button class="mark-complete-btn" data-task-id="${task._id}">Mark as Complete</button>
                `;
                tasksList.appendChild(taskItem);
            });
        } else {
            tasksList.innerHTML = '<p>No tasks found for this course.</p>';
        }
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        alert(error.message);
    }
});

// Handle click events for "Mark as Complete" buttons
document.getElementById('tasksList').addEventListener('click', async function(event) {
    if (event.target.classList.contains('mark-complete-btn')) {
        const taskId = event.target.getAttribute('data-task-id');

        try {
            const response = await fetch(`https://gu-intern-week-7.onrender.com/tasks/${taskId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete task');
            }

            // Remove the task from the UI
            event.target.closest('.task-item').remove();
            alert(result.message || 'Task marked as complete and deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert(error.message);
        }
    }
});

