import logo from "../../styles/images/logo.png";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [searchType, setSearchType] = useState("ingredient");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`api/finder/getRecipesByIngredients/ingredients=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  

  return (
    <div className="home">
      <header>
        <h1>Recipe Finder</h1>
      </header>
      <main>
        <img src={logo} alt="Recipe Finder logo" />
        <form onSubmit={useEffect}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ingredient"
          />
          <button type="submit">Search</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {recipes && (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Home;
