import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(`api/finder/getRecipeById/${id}`)
      .then((response) => {
        console.log("Recipe:", response.data);
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error("Error getting recipe by id:", error);
      });
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <p>Instructions: {recipe.instructions}</p>
    </div>
  );
};

export default RecipeDetail;
