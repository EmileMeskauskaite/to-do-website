import React, { useState } from 'react';

export default function ToDoList({ tasks, getToDoList }) {
  const [loading, setLoading] = useState(false); 
  const handleDelete = async (taskId) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('No userId found');
      return;
    }

    setLoading(true); 

    const response = await fetch(`http://localhost:3000/delete_task/${userId}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLoading(false); 
    if (response.ok) {
      getToDoList(); 
    } else {
      console.error('Failed to delete task');
    }
  };

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
      getToDoList();
    } else {
      console.error('Failed to update task status');
    }
  };

  return (
    <div className="container">
      {loading && <div className="loading-spinner">Loading...</div>}
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.task}</h5>
              <p>{task.description}</p>
              <p><strong>Created on:</strong> {task.createdAt}</p>

              <select
                className="form-select form-select-sm"
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)} 
              >
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="On Wait">On Wait</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(task._id)}
              disabled={loading} 
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
