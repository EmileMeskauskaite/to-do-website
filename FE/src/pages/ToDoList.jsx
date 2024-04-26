import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ToDoList() {
  const [tasks, setTasks] = useState([])
  const location = useLocation();
  const userId = location.state?.userId;

  async function getToDoList() {
    const response = await fetch(`http://localhost:3000/to-do-page/${userId}`);
    const todos = await response.json();
    console.log(todos); 
    setTasks(todos);
  }
  
  async function handleDelete(id) {
    const response = await fetch(`http://localhost:3000/delete_task/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  
    if (response.ok) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      console.error('Failed to delete task');
    }
  }
  useEffect(() => {
    getToDoList();
  }, []);

  return (
    <div className="container">
      {tasks.map(task => (
        <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5>{task.task}</h5>
            <p>{task.description}</p>
            {/* Button to delete task */}
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        </li>
      ))}
    </div>
  );
}