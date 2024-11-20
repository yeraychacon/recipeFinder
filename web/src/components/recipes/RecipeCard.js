import React from "react";
import "../../styles/RecipeCard.css";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <img src={recipe.image} alt={recipe.title} className="card-image" />
        <div className="card-content">
          <h2>{recipe.title}</h2>
          <p>Ready in: {recipe.readyInMinutes} mins</p>
          <p>Servings: {recipe.servings}</p>
        </div>
      </div>
    </>
  );
};

export default RecipeCard;
