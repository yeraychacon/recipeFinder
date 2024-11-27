import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./styles/App.css";

import Register from "./components/login/Register.js";
import Login from "./components/login/Login.js";
import Header from "./components/header/Header.js";
import Home from "./components/recipes/Home.js";
import RecipeDetail from "./components/recipes/RecipeDetail.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header />}

        <Routes>
          <Route path="/" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/" />}
          />
          <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
