import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToDoList from './ToDoList';

export default function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const [task, settask] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [isLoading, setIsLoading] = useState(true); 
  const userId = localStorage.getItem('userId'); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login-page";
    }
  }, [userId]);

  // Function to get tasks
  const getToDoList = async () => {
    if (!userId) return;
    const response = await fetch(`http://localhost:3000/to-do-page/${userId}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.ok) {
      const todos = await response.json();
      setTasks(todos);
      setIsLoading(false);
    } else {
      console.error('Failed to fetch todos', response.status);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !description.trim()) return;

    const response = await fetch('http://localhost:3000/create_todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, description, userId, status }),
    });

    if (response.ok) {
      await getToDoList();
      settask('');
      setDescription('');
      setStatus('In Progress');
    } else {
      console.error('Failed to create task');
    }
  };

  useEffect(() => {
    if (userId) {
      getToDoList();
    }
  }, [userId]);

  const handleLogout = async () => {
    const response = await fetch(`http://localhost:3000/logout/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activeStatus: false }),
    });

    if (response.ok) {
      localStorage.removeItem('userId');
      window.location.href = '/login-page';
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>To-Do List</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="task" className="form-label">Task</label>
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
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select 
                id="status" 
                className="form-control" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="On Wait">On Wait</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Tasks</h2>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <ToDoList tasks={tasks} getToDoList={getToDoList} />
          )}
        </div>
      </div>
      <Link to="/login-page" className="btn btn-primary" onClick={handleLogout} style={{ position: 'absolute', top: '10px', left: '10px' }}>Log out</Link>
    </div>
  );
}
