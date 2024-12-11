import React, { useEffect, useState } from "react";
import "../../styles/RecipeCard.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";

const RecipeCard = ({ recipe, token }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Manejo del clic en la tarjeta
  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  // Verificar si la receta ya es favorita
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log("Verificando si la receta es favorita:", recipe.id);
        const response = await axios.post(
          "/api/auth/favRecipe/check",
          { recipeId: recipe.id.toString() }, // Asegúrate de usar recipeId según tu backend
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Respuesta de check favoritos:", response.data);
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Error verificando favoritos:", error.response || error);
      }
    };
    fetchFavorites();
  }, [recipe.id, token]);

  // Alternar favoritos
  const toggleFavorite = async (event) => {
    event.stopPropagation(); // Previene la navegación al hacer clic en la estrella
    console.log(`Alternando favorito para la receta: ${recipe.id}`);

    try {
      if (isFavorite) {
        // Eliminar de favoritos
        const response = await axios.delete("/api/auth/favRecipe/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { recipe: recipe.id.toString() }, // Usa la clave `recipe` según tu backend
        });
        console.log("Receta eliminada de favoritos:", response.data);
      } else {
        // Añadir a favoritos
        const response = await axios.post(
          "/api/auth/favRecipe/add",
          { recipe: recipe.id.toString() }, // Usa la clave `recipe` según tu backend
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Receta añadida a favoritos:", response.data);
      }
      setIsFavorite(!isFavorite); // Actualiza el estado local
    } catch (error) {
      console.error("Error alternando favoritos:", error.response || error);
    }
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={recipe.image} alt={recipe.title} className="card-image" />
      <h3>{recipe.title}</h3>
      <p>Ready in: {recipe.readyInMinutes} mins</p>
      <p>Servings: {recipe.servings}</p>
      {/* Icono de favoritos */}
      <div
        className="favorite-icon"
        onClick={toggleFavorite} // Manejo del clic en la estrella
      >
        {isFavorite ? <FaStar color="gold" /> : <FaRegStar />}
      </div>
    </div>
  );
};

export default RecipeCard;
