import React from 'react';

export default function ToDoList({ tasks, getToDoList }) {

  // Handle delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await fetch(`http://localhost:3000/delete_task/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass token in the Authorization header
      }
    });

    if (response.ok) {
      getToDoList(); // Refresh the task list after deletion
    } else {
      console.error('Failed to delete task');
    }
  };

  return (
    <div className="container">
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.task}</h5>
              <p>{task.description}</p>
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
