import React, { useState } from 'react';
import ToDoList from './ToDoList';
import { useLocation,Link } from 'react-router-dom';

export default function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const location = useLocation();
  const userId = location.state.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const response = await fetch('http://localhost:3000/create_todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, userId })

    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks([...tasks, newTask]);

      setTitle('');
      setDescription('');
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
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
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