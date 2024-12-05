// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Header.css";
const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <h1>RecipeFinder</h1>
      <div className="menu-container">
        <nav className="menu">
          <Link to="/favorites">Favoritos</Link>
          <Link to="/#">Search Recipe by ingredients</Link>
          <button onClick={onLogout} className="logout-button">
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
