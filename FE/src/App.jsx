import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useNavigate } from 'react-router-dom';
import Mainpage from './pages/Mainpage'
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    navigate('/main-page');
  }, [navigate]);

  return (
    <Router>
      <Route path="/main-page" element={<Mainpage />} />
    </Router>
  );
}

export default App;