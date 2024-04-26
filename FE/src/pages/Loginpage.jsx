import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
    
      //console.log('Response status:', response.status);
      //console.log('Response data:', data);
      //console.log('User ID:', data.user.id);    
      localStorage.setItem('token', token); 
   

      setUsername("");
      setPassword("");
      setMessage("Login successful!");
    
      // Navigate to TodoPage with user's ID as state
      navigate('/to-do-page', { state: { userId: data.user.id } });
    } else {
      setMessage("Login failed.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <Link to="/main-page" className="btn btn-primary mb-3 float-start">Home</Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}