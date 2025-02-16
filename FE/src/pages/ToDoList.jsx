import React, { useState } from 'react';

export default function ToDoList({ tasks, getToDoList }) {
  const [loading, setLoading] = useState(false); // State to track loading status

  // Handle delete
  const handleDelete = async (taskId) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('No userId found');
      return;
    }

    setLoading(true); // Set loading to true when deleting

    const response = await fetch(`http://localhost:3000/delete_task/${userId}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLoading(false); // Set loading to false when the request is finished

    if (response.ok) {
      // If successful, update the task list
      getToDoList(); // Reload the task list from the server
    } else {
      console.error('Failed to delete task');
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('No userId found');
      return;
    }

    const response = await fetch(`http://localhost:3000/update_task_status/${userId}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      // Reload task list after status change
      getToDoList();
    } else {
      console.error('Failed to update task status');
    }
  };

  return (
    <div className="container">
      {loading && <div className="loading-spinner">Loading...</div>} {/* Show loading spinner */}
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.task}</h5>
              <p>{task.description}</p>
              <p><strong>Created on:</strong> {task.createdAt}</p> {/* Assuming createdAt is formatted correctly in MM/DD/YYYY */}
              
              {/* Dropdown for selecting task status */}
              <select
                className="form-select form-select-sm"
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)} // Trigger status change
              >
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="On Wait">On Wait</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Delete button */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(task._id)}
              disabled={loading} // Disable delete button during loading
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
