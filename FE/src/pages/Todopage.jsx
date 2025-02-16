import React, { useState, useEffect } from 'react';
import ToDoList from './ToDoList';
import { Link } from 'react-router-dom';

export default function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const [task, settask] = useState('');
  const [description, setDescription] = useState('');
  
  const userId = localStorage.getItem('userId');  // Get the userId from localStorage
  console.log(userId);
  // Ensure userId is available, if not redirect to login page
  useEffect(() => {
    if (!userId) {
      window.location.href = "/login-page"; // Redirect to login if no userId found in localStorage
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !description.trim()) return;
  
    const response = await fetch('http://localhost:3000/create_todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task, description, userId })
    });
  
    if (response.ok) {
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
  
      settask('');
      setDescription('');
    }
  };
  console.log({ task, description, userId });
  

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>To-Do List</h2>
          {/* Form for adding tasks */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="task" className="form-label">task</label>
              <input 
                type="text" 
                className="form-control" 
                id="task" 
                value={task} 
                onChange={(e) => settask(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea 
                className="form-control" 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Tasks</h2>
          <ul className="list-group">
            <ToDoList />
          </ul>
        </div>
      </div>
      <Link to="/login-page" className="btn btn-primary" style={{ position: 'absolute', top: '10px', left: '10px' }}>Log out</Link>
    </div>
  );
}
