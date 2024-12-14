import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/RecipeList.css";
import RecipeCard from "./RecipeCard";

const FavoritesList = () => {
  const token = localStorage.getItem("token");
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/favRecipe/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Favorites:", response.data);
        const recipePromises = [];
        for (const item of response.data) {
          const promise = axios
            .get(`/api/finder/getRecipeById/?id=${item.idRecipe}`)
            .then((response) => response.data);
          recipePromises.push(promise);
        }
        Promise.all(recipePromises)
          .then((recipes) => {
            console.log("Recipes:", recipes);
            setFavoriteRecipes(recipes);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error getting recipes:", error);
            setLoading(false);
            setError("An error occurred. Try again later.");
          });
      })
      .catch((error) => {
        console.error("Error getting favorites:", error);
        setLoading(false);
        setError("An error occurred. Try again later.");
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={"error-container"}>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="recipe-list-header">
        <h2>Favorite Recipes</h2>
      </div>
      <div className="recipe-container">
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
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

export default FavoritesList;
