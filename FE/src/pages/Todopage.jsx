import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToDoList from './ToDoList';

export default function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const [task, settask] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const userId = localStorage.getItem('userId');  // Get the userId from localStorage
  const navigate = useNavigate();

  // Ensure userId is available, if not redirect to login page
  useEffect(() => {
    if (!userId) {
      window.location.href = "/login-page"; // Redirect to login if no userId found in localStorage
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
      setTasks(todos); // Update state with tasks
      setIsLoading(false); // Set loading state to false once the tasks are loaded
    } else {
      console.error('Failed to fetch todos', response.status);
    }
  };

  // Handle task creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !description.trim()) return;

    const response = await fetch('http://localhost:3000/create_todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, description, userId }),
    });

    if (response.ok) {
      await getToDoList(); // Refresh the task list
      settask('');
      setDescription('');
    } else {
      console.error('Failed to create task');
    }
  };

  // Load tasks when userId is available
  useEffect(() => {
    if (userId) {
      getToDoList();
    }
  }, [userId]); // Trigger when userId changes or is available

  // Handle logout
  const handleLogout = async () => {
    // Send a request to set the active status to false on the server
    const response = await fetch(`http://localhost:3000/logout/${userId}`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activeStatus: false }),
    });

    if (response.ok) {
      // Clear the userId from localStorage and redirect to login page
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
          {/* Form for adding tasks */}
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
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Tasks</h2>
          {isLoading ? (
            <p>Loading tasks...</p> // Show loading message until tasks are fetched
          ) : (
            <ToDoList tasks={tasks} getToDoList={getToDoList} /> // Pass tasks and getToDoList to ToDoList
          )}
        </div>
      </div>
      <Link to="/login-page" className="btn btn-primary" onClick={handleLogout} style={{ position: 'absolute', top: '10px', left: '10px' }}>Log out</Link>
    </div>
  );
}
