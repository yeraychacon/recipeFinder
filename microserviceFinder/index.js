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

const MealPlanSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["day", "week"], // Define si es un plan diario o semanal
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  meals: {
    // Para planes diarios: contiene directamente los objetos con IDs de recetas
    type: [
      {
        id: {
          type: Number, // ID de la receta
          required: true,
        },
      },
    ],
    required: function () {
      return this.type === "daily";
    },
  },
  week: {
    // Para planes semanales: contiene un objeto con los días de la semana
    type: {
      monday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      tuesday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      wednesday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      thursday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      friday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      saturday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      sunday: {
        type: [
          {
            id: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
    },
    required: function () {
      return this.type === "weekly";
    },
  },
});

const MealPlan = mongoose.model("MealPlan", MealPlanSchema);

module.exports = { Recipe, MealPlan };

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

async function saveMealPlan(mealPlanData) {
  try {
    // Verifica si el MealPlan es de tipo "week"
    console.log("mealPlanData:", mealPlanData); // Depuración: Ver los datos recibidos
    if (mealPlanData.type === "week") {
      // Asegúrate de que cada día de la semana sea un arreglo
      const weekData = {
        monday: Array.isArray(mealPlanData.week.monday)
          ? mealPlanData.week.monday.map((meal) => ({ id: meal.id }))
          : [],
        tuesday: Array.isArray(mealPlanData.week.tuesday)
          ? mealPlanData.week.tuesday.map((meal) => ({ id: meal.id }))
          : [],
        wednesday: Array.isArray(mealPlanData.week.wednesday)
          ? mealPlanData.week.wednesday.map((meal) => ({ id: meal.id }))
          : [],
        thursday: Array.isArray(mealPlanData.week.thursday)
          ? mealPlanData.week.thursday.map((meal) => ({ id: meal.id }))
          : [],
        friday: Array.isArray(mealPlanData.week.friday)
          ? mealPlanData.week.friday.map((meal) => ({ id: meal.id }))
          : [],
        saturday: Array.isArray(mealPlanData.week.saturday)
          ? mealPlanData.week.saturday.map((meal) => ({ id: meal.id }))
          : [],
        sunday: Array.isArray(mealPlanData.week.sunday)
          ? mealPlanData.week.sunday.map((meal) => ({ id: meal.id }))
          : [],
      };

      // Verifica si alguna de las propiedades de la semana está vacía (depuración)
      console.log("Week data:", weekData);

      // Si todos los días están vacíos, lanza un error
      if (Object.values(weekData).every((day) => day.length === 0)) {
        throw new Error("No meals provided for any day of the week.");
      }

      const mealPlan = new MealPlan({
        id: mealPlanData.id, // ID del MealPlan
        type: "week", // Tipo de MealPlan
        week: weekData, // Los datos procesados de la semana
      });

      // Guarda el MealPlan semanal
      await mealPlan.save();
      console.log("Weekly Meal Plan saved successfully!");
    } else if (mealPlanData.type === "day") {
      // Para un plan diario
      const mealPlan = new MealPlan({
        id: mealPlanData.id, // ID del MealPlan
        type: "day", // Tipo de MealPlan
        meals: mealPlanData.meals.map((meal) => ({ id: meal.id })), // Guarda las recetas para el día
      });

      // Guarda el MealPlan diario
      await mealPlan.save();
      console.log("Daily Meal Plan saved successfully!");
    } else {
      throw new Error("Invalid meal plan type.");
    }
  } catch (error) {
    console.error("Error saving meal plan:", error.message);
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
 * /finder/getRandomRecipes:
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

app.get("/finder/generateMealPlan", async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const timeFrame = req.query.timeFrame || "day";
    const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=${timeFrame}`;

    const response = await axios.get(url);
    const data = response.data;

    // Generate unique 5-digit IDs for each meal
    const existingMealPlans = await MealPlan.find();
    const existingIds = new Set(existingMealPlans.map((meal) => meal.id));

    // Generate unique ID for the meal plan
    let mealPlanId;
    do {
      mealPlanId = Math.floor(10000 + Math.random() * 90000);
    } while (existingIds.has(mealPlanId));
    existingIds.add(mealPlanId);

    // Save the meal plan with the correct type
    const mealPlan = {
      id: mealPlanId,
      type: timeFrame === "day" ? "day" : "week",
      meals: timeFrame === "day" ? data.meals : undefined,
      week: timeFrame === "week" ? data.week : undefined,
    };
    console.log("Meal plan:", mealPlan);

    await saveMealPlan(mealPlan);

    res.json(mealPlan);
    console.log("Meal plan generated and saved successfully");
  } catch (error) {
    console.error("Error generating meal plan:", error.message);
    res.status(500).json({ error: "Failed to generate meal plan" });
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

app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});
