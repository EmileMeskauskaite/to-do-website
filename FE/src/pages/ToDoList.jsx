import React from 'react';

export default function ToDoList({ tasks, getToDoList }) {

  // Handle delete
  const handleDelete = async (taskId) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('No userId found');
      return;
    }
  
    const response = await fetch(`http://localhost:3000/delete_task/${userId}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // Pakeistas kodas, kad atnaujintų užduočių sąrašą
      getToDoList(); // Atkuriama užduočių sąrašą iš serverio
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
