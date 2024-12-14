import React, { useState } from "react";
import "../../styles/Meals.css"; // Importamos los estilos desde un archivo CSS separado

// Simulación de una API que devuelven comidas
const getMealsForDay = (day) => {
  const meals = [
    { id: 1, title: "Blueberry Pancakes", readyInMinutes: 30, servings: 2 },
    { id: 2, title: "Spaghetti Carbonara", readyInMinutes: 20, servings: 4 },
    { id: 3, title: "Vegetable Stir Fry", readyInMinutes: 25, servings: 3 },
  ];
  return meals;
};

const getMealsForWeek = () => {
  const weekMeals = {
    monday: getMealsForDay("Monday"),
    tuesday: getMealsForDay("Tuesday"),
    wednesday: getMealsForDay("Wednesday"),
    thursday: getMealsForDay("Thursday"),
    friday: getMealsForDay("Friday"),
    saturday: getMealsForDay("Saturday"),
    sunday: getMealsForDay("Sunday"),
  };
  return weekMeals;
};

const MealPlanApp = () => {
  const [mealType, setMealType] = useState("day"); // 'day' o 'week'
  const [mealPlan, setMealPlan] = useState(null); // Para almacenar el plan de comidas generado
  const [isOptionsVisible, setIsOptionsVisible] = useState(true); // Para controlar si las opciones están visibles

  // Función para generar el meal plan según el tipo seleccionado
  const generateMealPlan = () => {
    setIsOptionsVisible(false); // Ocultamos las opciones una vez generado el plan

    if (mealType === "day") {
      const meals = getMealsForDay("day");
      setMealPlan({ type: "day", meals });
    } else if (mealType === "week") {
      const meals = getMealsForWeek();
      setMealPlan({ type: "week", meals });
    }
  };

  // Renderiza el meal plan como horario de clases
  const renderMealsAsSchedule = () => {
    if (mealPlan && mealPlan.type === "week") {
      const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      return (
        <div className="schedule-container">
          <div className="days-header">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-column">
                <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
              </div>
            ))}
          </div>
          <div className="meal-rows">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div className="meal-row" key={rowIndex}>
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="meal-cell">
                    <p>
                      <strong>{mealPlan.meals[day][rowIndex].title}</strong>
                    </p>
                    <p>
                      Ready in: {mealPlan.meals[day][rowIndex].readyInMinutes}{" "}
                      min
                    </p>
                    <p>Servings: {mealPlan.meals[day][rowIndex].servings}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="meal-plan-app">
      <h1>Meal Planer</h1>
      <div className="options-container">
        {isOptionsVisible ? (
          <div className="meal-options">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
            <button onClick={generateMealPlan}>Generate Plan</button>
          </div>
        ) : (
          <div className="meal-plan-content">
            <h2>
              {mealPlan.type === "day" ? "Daily Meal Plan" : "Weekly Meal Plan"}
            </h2>
            {mealPlan.type === "week" && renderMealsAsSchedule()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanApp;
