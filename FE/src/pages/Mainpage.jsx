import React from 'react';
import { Link } from 'react-router-dom';

export default function MainPage() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1>Welcome to Your To-Do List App</h1>
          <p className="lead">Manage your tasks easily and efficiently.</p>
          <div className="mt-4">
            <Link to="/login-page" className="btn btn-primary me-2">Login</Link>
            <Link to="/register-page" className="btn btn-outline-primary">Sign Up</Link>

          </div>
        </div>
      </div>
    </div>
  );
}
