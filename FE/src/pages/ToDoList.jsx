import React from 'react';

export default function ToDoList({ tasks, getToDoList }) {
  const userId = localStorage.getItem('userId'); // Assuming the userId is stored in localStorage

  // Handle task status change
  const handleStatusChange = async (taskId, newStatus) => {
    const response = await fetch(`http://localhost:3000/update_task_status/${userId}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus }), // Send newStatus in the request body
    });

    if (response.ok) {
      await getToDoList(); // Refresh the task list after updating
    } else {
      console.error('Failed to update task status');
    }
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    const response = await fetch(`http://localhost:3000/delete_task/${userId}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      await getToDoList(); // Refresh task list after deletion
    } else {
      console.error('Failed to delete task');
    }
  };

  return (
    <div className="container">
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.task}</h5>
              <p>{task.description}</p>

              {/* Dropdown to select new status */}
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)} // Trigger status change
              >
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="On Wait">On Wait</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
