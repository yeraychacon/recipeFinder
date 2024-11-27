import React from "react";
import PropTypes from "prop-types";

const IngredientCard = ({ ingredient }) => {
  return (
    <div className="ingredient-card">
      <img src={ingredient.image} alt={ingredient.name} />
      <h2>{ingredient.name}</h2>
      <p>Amount: {ingredient.amount}</p>
      <p>Unit: {ingredient.unit}</p>
    </div>
  );
};

export default IngredientCard;
