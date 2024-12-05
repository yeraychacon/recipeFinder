import React, { useEffect, useState } from "react";
import axios from "axios";
import IngredientCard from "./ingredientCard";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "../../styles/RecipeDetail.css";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [peticion, setPeticion] = useState(null);

  useEffect(() => {
    console.log("Recipe ID:", recipeId);
    axios
      .get(`/api/finder/getRecipeById/?id=${recipeId}`)
      .then((response) => {
        console.log("Recipe:", response.data);
        setRecipe(response.data);
        axios
          .get(`/api/finder/getRecipeIngredients/?id=${recipeId}`)
          .then((response) => {
            console.log("Ingredients:", response.data);
            setIngredients(response.data);
            setPeticion(`/api/finder/getRecipeIngredients/?id=${recipeId}`);
          })
          .catch((error) => {
            console.error("Error getting ingredients by recipe id:", error);
          });
      })
      .catch((error) => {
        console.error("Error getting recipe by id:", error);
      });
  }, [recipeId]);

  if (!recipe) {
    return <div className="loading">Loading...</div>;
  }

  const sanitizeInstructions = (instructions) => {
    return instructions.replace(/<[^>]*>/g, "").replace(/\n/g, " ");
  };

  const cleanHTML = DOMPurify.sanitize(recipe.instructions);

  return (
    <div className="recipe-detail">
      <div className="container-head">
        <div className="container-img">
          <img src={recipe.recipeImage} alt={recipe.title} />
        </div>
        <h1>{recipe.title}</h1>
        <p>Servings: {recipe.servings}</p>
        <p>Ready In: {recipe.totalTime} minutes</p>
        <div className="container-info">
          <div className="container-container">
            <h2>Ingredients</h2>
            <div className="content-container">
              <img src={peticion} />
            </div>
          </div>
          <div className="container-container">
            <h2>Instructions</h2>

            <div
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
              className="container-instructions"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
