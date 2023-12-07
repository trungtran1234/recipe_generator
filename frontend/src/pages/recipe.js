import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
 
function Recipe(){
    const location = useLocation();
    const navigate = useNavigate();
    const recipes = location.state?.recipes || [];
    console.log(recipes)
 
  return (
    <div>
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