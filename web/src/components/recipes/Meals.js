// Importamos React y hooks necesarios
import React, { useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";

const Meals = () => {
  const [timeFrame, setTimeFrame] = useState("day"); // Estado para seleccionar diario o semanal
  const [mealPlan, setMealPlan] = useState(null); // Estado para almacenar el meal plan

  // Función para generar el meal plan
  const generateMealPlan = async () => {
    try {
      const response = await axios.get(
        `/api/finder/generateMealPlan?timeFrame=${timeFrame}`
      );
      setMealPlan(response.data); // Guardar los datos del meal plan
      console.log("Meal plan generated:", response.data);
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
      console.log("Recipe by ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
    }
  };

  // Renderizado condicional para meal plan diario
  const renderDailyPlan = () => (
    <div>
      <h2>Daily Meal Plan</h2>
      {mealPlan.meals.map(async (meal) => (
        <div key={meal.id}>
          <RecipeCard
            recipe={getRecipeById(meal.id)}
            id={meal.id}
            token={localStorage.getItem("token")}
          />
        </div>
      ))}
    </div>
  );

  // Renderizado condicional para meal plan semanal
  const renderWeeklyPlan = () => (
    <div>
      <h2>Weekly Meal Plan</h2>
      {Object.keys(mealPlan.week).map((day) => (
        <div key={day}>
          <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
          {mealPlan.week[day].meals.map(async (meal) => (
            <div key={meal.id}>
              <RecipeCard
                recipe={getRecipeById(meal.id)}
                id={meal.id}
                token={localStorage.getItem("token")}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1>Meal Plan Finder</h1>

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

      {/* Botón para generar el meal plan */}
      <button onClick={generateMealPlan}>Generate Meal Plan</button>

      {/* Renderizado condicional según el tipo de plan */}
      {mealPlan &&
        (timeFrame === "day" ? renderDailyPlan() : renderWeeklyPlan())}

      {/* Mostrar favoritos */}
    </div>
  );
};

export default Meals;
