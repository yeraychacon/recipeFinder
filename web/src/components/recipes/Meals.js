import React, { useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import "../../styles/Meals.css";

const Meals = () => {
  const [timeFrame, setTimeFrame] = useState("day"); // Estado para seleccionar diario o semanal
  const [mealPlan, setMealPlan] = useState(null); // Estado para almacenar el meal plan
  const [recipes, setRecipes] = useState({}); // Estado para almacenar recetas individuales
  const token = localStorage.getItem("token");
  // Función para generar el meal plan
  const generateMealPlan = async () => {
    try {
      const response = await axios.get(
        `/api/finder/generateMealPlan?timeFrame=${timeFrame}`
      );
      setMealPlan(response.data); // Guardar los datos del meal plan
      console.log("Meal plan generated:", response.data);

      // Obtener recetas para cada meal del plan
      setMealPlan(response.data);
      const newRecipes = {};
      if (timeFrame === "day") {
        await Promise.all(
          response.data.meals.map(async (meal) => {
            newRecipes[meal.id] = await getRecipeById(meal.id);
          })
        );
      } else if (timeFrame === "week") {
        await Promise.all(
          Object.keys(response.data.week).map(async (day) => {
            const meals = response.data.week[day].meals;
            await Promise.all(
              meals.map(async (meal) => {
                newRecipes[meal.id] = await getRecipeById(meal.id);
              })
            );
          })
        );
      }
      setRecipes(newRecipes);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  

  
  const getRecipeById = async (id) => {
    try {
      console.log("Fetching recipe by ID:", id);
      const response = await axios.get(
        `/api/finder/getRecipeInformation?id=${id}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      return null;
    }
  };

  const renderDailyPlan = () => (
    <div>
      <h2>Daily Meal Plan</h2>
      <div className="daily-plan">
        {mealPlan.meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            {recipes[meal.id] ? (
              <RecipeCard
                recipe={recipes[meal.id]}
                id={meal.id}
                token={localStorage.getItem("token")}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizado para meal plan semanal
  const renderWeeklyPlan = () => (
    <div>
      <h2>Weekly Meal Plan</h2>
      <div className="weekly-plan">
        {Object.keys(mealPlan.week).map((day) => (
          <div key={day} className="day-container">
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {mealPlan.week[day].meals.map((meal) => (
              <div key={meal.id} className="meal-card">
                {recipes[meal.id] ? (
                  <RecipeCard
                    recipe={recipes[meal.id]}
                    id={meal.id}
                    token={localStorage.getItem("token")}
                  />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="meals-container">
      <h1>Meal Planner </h1>

      {/* Selector para elegir tipo de plan */}
      <label htmlFor="timeFrame">Select Time Frame: </label>
      <select
        id="timeFrame"
        value={timeFrame}
        onChange={(e) => setTimeFrame(e.target.value)}
      >
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
      </select>

      {/* Contenedor para botones */}
      <div className="buttons-container">
        <button onClick={generateMealPlan} className="generate-meal">
          Generate Meal Plan
        </button>

      </div>

      {/* Renderizado condicional según el tipo de plan */}
      {mealPlan &&
        (timeFrame === "day" ? renderDailyPlan() : renderWeeklyPlan())}
    </div>
  );
};

export default Meals;
