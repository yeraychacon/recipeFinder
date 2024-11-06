require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const connectDB = require('./config/db');




app.get('/finder/getRandomRecipes', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const number = req.query.number || 10; // Default to 10 if not provided
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=${number}`;

    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
    console.log('Random recipes obtained successfully');
  } catch (error) {
    console.error('Error obtaining random recipes:', error.message);
    res.status(500).json({ error: 'Failed to obtain random recipes' });
  }
});

app.get('/finder/getRecipeInformation', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const id = req.query.id;
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}?includeNutrition=false`;

    const response = await axios.get(url);
    const data = response.data;

    const formattedData = formatRecipeData(data);
    res.json(formattedData);
    console.log('Recipe information obtained and formatted successfully');
    
  } catch (error) {
    console.error('Error obtaining and formatting recipe information:', error.message);
    res.status(500).json({ error: 'Failed to obtain and format recipe information' });
  }
});

function formatRecipeData(recipe) {
  // Obtenemos la información básica de la receta
  const id = recipe.id;
  const title = recipe.title;
  const recipeImage = recipe.image;
  const servings = recipe.servings;
  const prepTime = recipe.preparationMinutes;
  const cookTime = recipe.cookingMinutes;
  const totalTime = recipe.readyInMinutes;
  const dishTypes = recipe.dishTypes;  // Incluimos los tipos de plato

  // Formateamos los ingredientes
  const ingredients = recipe.extendedIngredients.map(ingredient => {
      return {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          image: `https://img.spoonacular.com/ingredients/${ingredient.image}`
      };
  });

  // Formateamos el texto de preparación
  const instructions = recipe.instructions || "No instructions provided.";

  // Construimos un objeto con los datos formateados
  return {
      id: id,
      title: title,
      recipeImage: recipeImage,
      servings: servings,
      prepTime: `${prepTime} minutes`,
      cookTime: `${cookTime} minutes`,
      totalTime: `${totalTime} minutes`,
      dishTypes: dishTypes,
      ingredients: ingredients,
      instructions: instructions
  };
}




app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});