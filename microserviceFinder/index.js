require("dotenv").config();
const express = require("express");
const app = express();
const port = 4000;
const axios = require("axios");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

connectDB();

const RecipeSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  servings: Number,
  preparationMinutes: Number,
  cookingMinutes: Number,
  readyInMinutes: Number,
  dishTypes: [String],
  extendedIngredients: [
    {
      name: String,
      amount: Number,
      unit: String,
      image: String,
    },
  ],
  instructions: String,
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

async function saveRecipe(recipe) {
  try {
    const existingRecipe = await Recipe.findOne({ id: recipe.id });
    if (existingRecipe) {
      console.log("Recipe already exists");
      return;
    }
    const newRecipe = new Recipe(recipe);
    await newRecipe.save();
    console.log("Recipe saved successfully");
  } catch (error) {
    console.error("Error saving recipe:", error.message);
  }
}

async function getAllRecipes() {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    console.error("Error getting all recipes:", error.message);
  }
}

async function getRecipeById(id) {
  try {
    const recipe = await Recipe.findOne({ id: id });
    return recipe;
  } catch (error) {
    console.error("Error getting recipe by id:", error.message);
  }
}

app.get("/finder/getRecipeById", async (req, res) => {
  try {
    const id = req.query.id;
    const recipe = await getRecipeById(id);
    if (recipe) {
      const formattedData = formatRecipeData(recipe);
      res.json(formattedData);
      console.log("Recipe obtained by id and formatted successfully");
      console.log(formattedData);
    } else {
      res.status(404).json({ error: "Recipe not found" });
      console.log("Recipe not found");
    }
  } catch (error) {
    console.error(
      "Error obtaining and formatting recipe by id:",
      error.message
    );
    res.status(500).json({ error: "Failed to obtain and format recipe by id" });
  }
});

/**
 * @swagger
 * /finder/getAllRecipes:
 *  get:
 *   description: Use to request random recipes from the Spoonacular API
 *   responses:
 *    200:
 *      description: Random recipes obtained successfully
 *      content:
 *       application/json:
 *       schema:
 *       type: array
 *       items:
 *        $ref: '#/components/schemas/Recipe'
 *    500:
 *      description: Error obtaining random recipes
 *
 *
 */
app.get("/finder/getRandomRecipes", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const number = req.query.number || 30;
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=${number}`;

    const response = await axios.get(url);
    const data = response.data;

    data.recipes.forEach((recipe) => {
      saveRecipe(recipe);
    });

    res.json(data);
    console.log("Random recipes obtained successfully");
  } catch (error) {
    console.error("Error obtaining random recipes:", error.message);
    res.status(500).json({ error: "Failed to obtain random recipes" });
  }
});

/*
 * @swagger
 * /finder/getRecipeIngredients:
 *  get:
 *   description: Use to request all recipes from the database
 *   responses:
 *   '200':
 *      description: Recipe ingredients image sent successfully
 *      content:
 *       application/json:
 *       schema:
 *       type: object
 *      properties:
 *      recipes:
 *      type: array
 *  500:
 *    description: Error obtaining recipe ingredients image
 *
 */
app.get("/finder/getRecipeIngredients", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const id = req.query.id;
    const url = `https://api.spoonacular.com/recipes/${id}/ingredientWidget.png?apiKey=${apiKey}`;

    // Hacer una solicitud a la URL de la imagen
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Establecer el encabezado Content-Type basado en el tipo de imagen (PNG en este caso)
    res.set("Content-Type", "image/png");

    // Enviar los datos de la imagen directamente
    res.send(response.data);

    console.log("Recipe ingredients image sent successfully");
  } catch (error) {
    console.error("Error obtaining recipe ingredients image:", error.message);
    res
      .status(500)
      .json({ error: "Failed to obtain recipe ingredients image" });
  }
});

app.get("/finder/getRecipeInformation", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const id = req.query.id;
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}?includeNutrition=false`;

    const response = await axios.get(url);
    const data = response.data;

    data.recipes.forEach((recipe) => {
      saveRecipe(recipe);
    });

    const formattedData = formatRecipeData(data);
    res.json(formattedData);
    console.log("Recipe information obtained and formatted successfully");
  } catch (error) {
    console.error(
      "Error obtaining and formatting recipe information:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Failed to obtain and format recipe information" });
  }
});

app.delete("/finder/deleteAllRecipes", async (req, res) => {
  try {
    await Recipe.deleteMany({});
    res.json({ message: "All recipes deleted successfully" });
    console.log("All recipes deleted successfully");
  } catch (error) {
    console.error("Error deleting all recipes:", error.message);
    res.status(500).json({ error: "Failed to delete all recipes" });
  }
});

app.get("/finder/getRecipesByIngredients", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const ingredients = req.query.ingredients;
    const number = req.query.number || 10;

    console.log("Ingredients:", ingredients);
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=${number}`;

    const response = await axios.get(url);
    const data = response.data;

    res.json(data);

    data.forEach((recipe) => {
      saveRecipe(recipe);
    });
    console.log("Recipes by ingredients obtained successfully");
    console.log(data);
  } catch (error) {
    console.error("Error obtaining recipes by ingredients:", error.message);
    res.status(500).json({ error: "Failed to obtain recipes by ingredients" });
  }
});

function formatRecipeData(recipe) {
  console.log("Recipe:", recipe);
  // Obtenemos la información básica de la receta
  const id = recipe.id;
  const title = recipe.title;
  const recipeImage = recipe.image;
  const servings = recipe.servings;
  const prepTime = recipe.preparationMinutes;
  const cookTime = recipe.cookingMinutes;
  const totalTime = recipe.readyInMinutes;
  const dishTypes = recipe.dishTypes; // Incluimos los tipos de plato

  // Formateamos los ingredientes
  const ingredients = recipe.extendedIngredients.map((ingredient) => {
    return {
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      image: `https://img.spoonacular.com/ingredients/${ingredient.image}`,
    };
  });

  // Eliminamos las etiquetas <li> y <ol> de las instrucciones
  const cleanInstructions = recipe.instructions
    ? recipe.instructions.replace(/<\/?li>/g, "").replace(/<\/?ol>/g, "")
    : "No instructions provided.";

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
    instructions: instructions,
  };
}

app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});
