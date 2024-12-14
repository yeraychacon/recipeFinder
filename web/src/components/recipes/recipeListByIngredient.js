import React from "react";
import { useLocation } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import "../../styles/RecipeList.css";

const RecipeListByIngredient = () => {
  const location = useLocation();
  const { recipes } = location.state || { recipes: [] };

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

export default RecipeListByIngredient;
