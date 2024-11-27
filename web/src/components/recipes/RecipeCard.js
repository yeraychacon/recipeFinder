import React, { useState } from "react";
import "../../styles/RecipeCard.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const RecipeCard = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
        //onClick={toggleFavorite}
      ></div>
      <img src={recipe.image} alt={recipe.title} className="card-image" />
      <h3>{recipe.title}</h3>
      <p>Ready in: {recipe.readyInMinutes} mins</p>
      <p>Servings: {recipe.servings}</p>
    </div>
  );
};

export default RecipeCard;
