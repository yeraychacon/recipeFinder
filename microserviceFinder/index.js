require("dotenv").config();
const express = require("express");
const app = express();
const port = 4000;
const axios = require("axios");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

connectDB();

const RecipeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
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



module.exports = { Recipe };

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

/**
 * @swagger
 * /finder/getRecipeById:
 *   get:
 *     description: Fetches a recipe by its ID from the database, formats it, and returns it.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the recipe to fetch.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Recipe obtained and formatted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipe not found"
 *       500:
 *         description: Error occurred while fetching or formatting the recipe by ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to obtain and format recipe by id"
 */

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
 * /finder/getRandomRecipes:
 *   get:
 *     description: Fetches a list of random recipes from the Spoonacular API and saves them to the database.
 *     parameters:
 *       - in: query
 *         name: number
 *         required: false
 *         description: The number of random recipes to fetch (default is 30).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Random recipes obtained successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Error occurred while fetching random recipes.
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

/**
 * @swagger
 * /finder/getRecipeIngredients:
 *   get:
 *     description: Fetches an ingredient widget image for a specific recipe by ID from the Spoonacular API.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the recipe to fetch the ingredient widget image for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe ingredient widget image retrieved successfully.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error occurred while fetching the recipe ingredients image.
 */

app.get("/finder/getRecipeIngredients", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const id = req.query.id;
    const url = `https://api.spoonacular.com/recipes/${id}/ingredientWidget.png?apiKey=${apiKey}&measure=metric`;

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

/**
 * @swagger
 * /finder/getRecipeInformation:
 *   get:
 *     description: Fetches a recipe by ID. Checks the database first; if not found, retrieves the data from the Spoonacular API.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the recipe to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe information obtained successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Error occurred while fetching the recipe information.
 */

app.get("/finder/getRecipeInformation", async (req, res) => {
  try {
    const id = req.query.id;
    console.log("ID:", id);

    // Check if the recipe exists in the database
    const recipe = await getRecipeById(id);
    if (recipe) {
      const formattedData = formatRecipeData(recipe);
      res.json(formattedData);
      console.log("Recipe obtained from database and formatted successfully");
      return;
    }

    // If the recipe does not exist in the database, fetch it from the API
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=false`;

    const response = await axios.get(url);
    const data = response.data;
    console.log(response.data);

    // Save the new recipe to the database
    await saveRecipe(response.data);

    const formattedData = formatRecipeData(data);
    res.json(formattedData);
    console.log("Recipe information obtained from API and formatted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to obtain and format recipe information" });
  }
});

/**
 * @swagger
 * /finder/getRecipesByIngredients:
 *   get:
 *     description: Fetches recipes based on a list of ingredients from the Spoonacular API.
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         required: true
 *         description: Comma-separated list of ingredients to filter recipes.
 *         schema:
 *           type: string
 *       - in: query
 *         name: number
 *         required: false
 *         description: Number of recipes to fetch. Default is 30.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipes obtained successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Error obtaining recipes by ingredients.
 */

app.get("/finder/getRecipesByIngredients", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const ingredients = req.query.ingredients;
    const number = req.query.number || 30;

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


/**
 * @swagger
 * /finder/generateMealPlan:
 *   get:
 *     description: Generates a meal plan for a day or week using the Spoonacular API.
 *     parameters:
 *       - in: query
 *         name: timeFrame
 *         required: false
 *         description: Specifies whether the meal plan is for a "day" or "week". Defaults to "day".
 *         schema:
 *           type: string
 *           enum: [day, week]
 *     responses:
 *       200:
 *         description: Meal plan generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the generated meal plan.
 *                 type:
 *                   type: string
 *                   description: The type of meal plan ("daily" or "weekly").
 *                 meals:
 *                   type: array
 *                   description: List of meals for a daily meal plan.
 *                   items:
 *                     type: object
 *                     description: A meal object from Spoonacular API.
 *                 week:
 *                   type: object
 *                   description: Weekly meal plan data if `timeFrame` is set to "week".
 *       500:
 *         description: Error generating meal plan.
 */
app.get("/finder/generateMealPlan", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const timeFrame = req.query.timeFrame || "day";
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=${timeFrame}`;
    let id;
    let isUnique = false;

    const response = await axios.get(url);
    const data = response.data;

    const formattedData = {
      type: timeFrame === "day" ? "daily" : "weekly",
      meals: timeFrame === "day" ? data.meals : [],
      week: timeFrame === "week" ? data.week : {},
    };

    
    res.json(formattedData);
    console.log("Meal plan fetched successfully");
  } catch (error) {
    console.error("Error fetching meal plan:", error);
  }
});

function formatRecipeData(recipe) {
  console.log("Recipe:", recipe);
  // Obtenemos la información básica de la receta
  const id = recipe.id;
  const title = recipe.title;
  const image = recipe.image;
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
      image: ingredient.image,
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
    image: image,
    servings: servings,
    prepTime: `${prepTime} minutes`,
    cookTime: `${cookTime} minutes`,
    totalTime: `${totalTime} minutes`,
    dishTypes: dishTypes,
    ingredients: ingredients,
    instructions: instructions,
  };
}

const swaggerDef= {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Microservice Finder",
      version: "1.0.0",
      description: "Microservice Finder API",
    },
    components: {
      schemas:{
        Recipe: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            image: { type: "string" },
            servings: { type: "number" },
            preparationMinutes: { type: "number" },
            cookingMinutes: { type: "number" },
            readyInMinutes: { type: "number" },
            dishTypes: { type: "array", items: { type: "string" } },
            extendedIngredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "number" },
                  unit: { type: "string" },
                  image: { type: "string" },
                },
              },
            },
            instructions: { type: "string" },
          }
        }
      },
    },
  },
  apis: [__filename], 
};


const swaggerSpec = swaggerJsdoc(swaggerDef);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});

