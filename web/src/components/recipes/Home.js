import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import "../../styles/RecipeList.css";

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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="recipe-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                id={recipe.id}
                token={localStorage.getItem("token")}
              />
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
