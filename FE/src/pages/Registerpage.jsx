import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import country from 'country-list-js';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [countryName, setCountryName] = useState(""); // Pasirinkta šalis
  const [message, setMessage] = useState("");

  // Gauti šalių pavadinimus iš `country-list-js`
  const countries = country.ls('name'); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validacija
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

    if (!fullname) {
      alert('Please enter your full name.');
      return;
    }

    if (!countryName) {
      alert('Please select your country.');
      return;
    }

    // Siųsti registracijos duomenis į backendą
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email, fullname, country: countryName }),
    });

    if (response.ok) {
      setUsername("");
      setPassword("");
      setEmail("");
      setFullname("");
      setCountryName("");
      setMessage("Registration successful!");
    } else {
      const errorData = await response.json();
      setMessage(`Registration failed: ${errorData.error || 'Unknown error'}`);
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
              <label htmlFor="fullname" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="fullname" value={fullname} onChange={e => setFullname(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <select className="form-control" id="country" value={countryName} onChange={e => setCountryName(e.target.value)}>
                <option value="">Select a country</option>
                {countries.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}
