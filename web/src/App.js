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
import FavoritesList from "./components/recipes/FavoritesList.js";
import RecipeListByIngredient from "./components/recipes/recipeListByIngredient.js";
import Meals from "./components/recipes/Meals.js";
import SavedMeals from "./components/recipes/SavedMeals.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    localStorage.removeItem("token");

    window.location.href = "/";
  }
};

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
          <Route path="/favorites" element={<FavoritesList />} />
          <Route path="/recipes" element={<RecipeListByIngredient />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/savedMeals" element={<SavedMeals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
