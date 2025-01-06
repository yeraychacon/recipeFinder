import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import "../../styles/Meals.css";

const SavedMeals = () => {
    const token = localStorage.getItem("token");
    const [savedMeals, setSavedMeals] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [recipes, setRecipes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        axios.get("/api/auth/SavedMeals/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log("Saved Meals:", response.data);
            const mealPromises = [];
            for (const item of response.data){
                const promise = axios.get(`/api/finder/getMealById/?id=${item.idMeal}`)
                .then((response) => response.data);
                mealPromises.push(promise);
            }
            Promise.all(mealPromises)
            .then((meals) => {
                console.log("Meals:", meals);
                setSavedMeals(meals);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error getting meals:", error);
                setLoading(false);
                setError("An error occurred. Try again later.");
            });
        })
        .catch((error) => {
            console.error("Error getting saved meals:", error);
            setLoading(false);
            setError("An error occurred. Try again later.");
        });
    },[token]);

      // Renderizado para meal plan diario
  const renderDailyPlan = (meals) => (
    <div>
      <h2>Daily Meal Plan</h2>
      <div className="daily-plan">
        {meals.meals.map((meal) => (
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
  const renderWeeklyPlan = (week) => (
    <div>
      <h2>Weekly Meal Plan</h2>
      <div className="weekly-plan">
        {Object.keys(week).map((day) => (
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
          <h1>Saved Meals</h1>
          <div className="saved-meals">
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                savedMeals.map((meal) => (
                    <div key={meal.id} className="meal-card">
                        {meal.type === "daily" ? renderDailyPlan(meal.meals) : renderWeeklyPlan(meal.week)}
                    </div>
                ))
            )}
          </div>
        </div>
      );
};
export default SavedMeals;