import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import '../css/buttons.css';

function Recipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipes = location.state?.recipes || [];
  console.log(recipes);

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button className="grayButton" onClick={navigateBack}>Back</button>
      <div className="recipes-container">
        {recipes.map((recipe, index) => (
          <div key={index}>
            <RecipeCard key={index} recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipe;