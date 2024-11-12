import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';


import './styles/App.css'


import Register from './components/auth/Register.js';
import Login from './components/auth/Login.js';
import Header from './components/header/Header.js';
import Home from './components/recipes/Home.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);

    console.log("AUTHENTIFICATED:",isAuthenticated);
  };

  return (
    <Router>
      <div className="App">
      {isAuthenticated && <Header />}

        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
