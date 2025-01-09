import React, { useState } from "react";
import "../../styles/Header.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado del menú lateral

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Por favor ingresa al menos un ingrediente.");
      return;
    }

    console.log("Buscando recetas con:", query);

    axios
      .get(`http://localhost:3000/api/finder/getRecipesByIngredients?ingredients=${query}`)
      .then((response) => {
        console.log(response.data);
        navigate("/recipes", { state: { recipes: response.data } });
        setQuery("");
      })
      .catch((error) => {
        console.error("Error searching recipes:", error.message);
      });
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/Home")}>
        <img src="../../styles/images/logo.png" alt="logo" className="logo" />
      </div>

      {/* Icono de menú (pantallas pequeñas) */}
      <div
        className="hamburger-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>

      {/* Menú lateral */}
      {isMenuOpen && (
        <div className="sidebar-menu">
          <button className="close-button" onClick={() => setIsMenuOpen(false)}>
            X
          </button>

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              placeholder="Search recipes by ingredients"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>

          <nav className="sidebar-nav">
            <Link
              to="/meals"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Generate Meal
            </Link>
            <Link
              to="/favorites"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
            <button
              onClick={onLogout}
              className="logout-button"
            >
              Log Out
            </button>
          </nav>
        </div>
      )}

      {/* Navegación para pantallas grandes */}
      <nav className="header-nav desktop-nav">
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="Search recipes by ingredients"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
        <Link to="/meals" className="nav-link">
          Generate Meal
        </Link>
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
        <button onClick={onLogout} className="logout-button">
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Header;
