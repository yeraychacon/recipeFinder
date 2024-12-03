import React, { useEffect, useState } from "react";
import axios from "axios";
import IngredientCard from "./ingredientCard";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    console.log("Recipe ID:", recipeId);
    axios
      .get(`/api/finder/getRecipeById/?id=${recipeId}`)
      .then((response) => {
        console.log("Recipe:", response.data);
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error("Error getting recipe by id:", error);
      });
  }, [recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const sanitizeInstructions = (instructions) => {
    return instructions.replace(/<[^>]*>/g, "").replace(/\n/g, " ");
  };

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <p>Servings: {recipe.servings}</p>
      <p>Preparation Time: {recipe.preparationMinutes} minutes</p>
      <p>Cooking Time: {recipe.cookingMinutes} minutes</p>
      <p>Ready In: {recipe.totalTime} minutes</p>
      <h2>Dish Types</h2>
      <ul>
        {recipe.dishTypes.map((dishType) => (
          <li key={dishType}>{dishType}</li>
        ))}
      </ul>

      <p>Instructions: {sanitizeInstructions(recipe.instructions)}</p>
    </div>
  );
};

export default RecipeDetail;
