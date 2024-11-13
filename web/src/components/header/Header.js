import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
    return(
        <header class name="header"> 
            <h1>RecipeFinder</h1>
            <div className="header-links">
                <Link to="/favorites">Favorites</Link>
                <Link to="/recipes">Recipes</Link>
            </div>
        </header>
    );
}

export default Header;