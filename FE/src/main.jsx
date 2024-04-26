import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

import App from './App'
import Mainpage from './pages/Mainpage'
import Registerpage from './pages/Registerpage'
import Loginpage from './pages/Loginpage'
import Todopage from './pages/Todopage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/main-page" element={<Mainpage />} />
      <Route path='/register-page' element={<Registerpage />} />
      <Route path='/login-page' element={<Loginpage />} />
      <Route path='/to-do-page' element={<Todopage />} />

      <Route path="*" element={<div> Puslapio nera! </div>} />
    </Routes>
  </BrowserRouter>
)