import React from "react";
import "../../styles/Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Login Out...");
    navigate("/"); // Redirige al login o a donde prefieras
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    console.log("Buscando recetas con:", query);
    // Aquí puedes agregar lógica para buscar recetas
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/Home")}>
        <img src="../../styles/images/logo.png" alt="logo" className="logo" />
      </div>
      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Search recipes by ingredients"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <nav className="header-nav">
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Header;
