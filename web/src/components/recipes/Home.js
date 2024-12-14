import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import "../../styles/RecipeList.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página inicial

  const fetchRecipes = (isInitial = false) => {
    setLoading(true);
    axios
      .get(`/api/finder/getRandomRecipes?page=${page}`)
      .then((response) => {
        const newRecipes = response.data.recipes.filter(
          (recipe) => !recipes.some((r) => r.id === recipe.id) // Evitar duplicados
        );
        setRecipes(isInitial ? newRecipes : [...recipes, ...newRecipes]);
        setLoading(false);
      })
      .catch(() => {
        setError("An error occurred. Try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes(true); // Cargar recetas iniciales
  }, []);

  const loadMoreRecipes = () => {
    setPage((prevPage) => prevPage + 1);
    fetchRecipes();
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="recipe-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                id={recipe.id}
                token={localStorage.getItem("token")}
              />
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
      <div className="load-more-container">
        <button className="load-more-button" onClick={loadMoreRecipes}>
          Load More Recipes
        </button>
      </div>
    </div>
  );
};

export default Home;
