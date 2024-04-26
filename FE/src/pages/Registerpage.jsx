import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!username || username.length < 3) {
      alert('Username must be at least 3 characters long.');
      return;
    }

    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    if (!fullName) {
      alert('Please enter your full name.');
      return;
    }
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email, fullName })
    });

    if (response.ok) { // Check if HTTP status is 2xx
      const data = await response.json();
      setUsername("");
      setPassword("");
      setEmail("");
      setFullName("");
      setMessage("Registration successful!");
    } else {
      setMessage("Registration failed.");
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
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="fullName" name="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}