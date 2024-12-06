import React, { useState } from "react";
import "../../styles/RecipeCard.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const RecipeCard = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    console.log(
      `${recipe.title} marked as ${!isFavorite ? "favorite" : "unfavorite"}`
    );
    console.log(isFavorite);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      ></div>
      <img src={recipe.image} alt={recipe.title} className="card-image" />
      <h3>{recipe.title}</h3>
      <p>Ready in: {recipe.readyInMinutes} mins</p>
      <p>Servings: {recipe.servings}</p>
      <div className="favorite-icon" onClick={toggleFavorite}>
        {isFavorite ? <FaStar color="gold" /> : <FaRegStar />}
      </div>
    </div>
  );
};

export default RecipeCard;
