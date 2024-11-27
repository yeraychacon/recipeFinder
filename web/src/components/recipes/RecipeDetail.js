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
      .get(`api/finder/getRecipeById/?id=${recipeId}`)
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
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      {recipe.ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          <IngredientCard ingredient={ingredient} />
        </div>
      ))}
      <p>Instructions: {sanitizeInstructions(recipe.instructions)}</p>
    </div>
  );
};

export default RecipeDetail;
