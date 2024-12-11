import axios from "axios";
import React, { useEffect } from "react";
import "../../styles/RecipeList.css";

const FavoritesList = () => {
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log("Favorites List");
    axios
      .get("/api/auth/favRecipe/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Favorites:", response.data);
        const recipePromises = response.data.map((item) =>
          axios
            .get(`/api/finder/getRecipeById/?id=${item.idRecipe}`)
            .then((response) => {
              console.log("Recipe:", response.data);
            })
        );

        Promise.all(recipePromises);
      })
      .catch((error) => {
        console.error("Error getting favorites:", error);
      });
  }, []);
  return (
    <div>
      <h2>Favorite Recipes</h2>
    </div>
  );
};

export default FavoritesList;
