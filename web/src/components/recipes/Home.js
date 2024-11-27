import logo from "../../styles/images/logo.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import "../../styles/RecipeCard.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/finder/getRandomRecipes/")
      .then((response) => {
        setRecipes(response.data.recipes);
        setLoading(false);
      })
      .catch((error) => {
        setError("An error occurred. Try again later.");
        setLoading(false);
      });
    console.log("Recipes:", recipes);
  }, []);

  if (loading) {
    return <p>Loading recipes...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div>
        <img src={logo} alt="Recipe Finder" />
      </div>
      <div>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
