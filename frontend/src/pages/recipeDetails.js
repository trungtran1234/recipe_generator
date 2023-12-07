import React from "react";
import { useLocation } from 'react-router-dom';
 
function RecipeDetails(){
  const location = useLocation();
    const { recipe } = location.state || {};
    const cookTime = recipe.recipe.totalTime === 0 ? "Fast" : `${recipe.recipe.totalTime} minutes`;
    const nutrients = recipe.recipe.totalNutrients;
    const nutritionInfo = {
      calories: Math.round(nutrients.ENERC_KCAL?.quantity) + ' ' + nutrients.ENERC_KCAL?.unit,
      carbs: Math.round(nutrients.CHOCDF?.quantity.toFixed(2)) + ' ' + nutrients.CHOCDF?.unit,
      fat: Math.round(nutrients.FAT?.quantity.toFixed(2)) + ' ' + nutrients.FAT?.unit,
      protein: Math.round(nutrients.PROCNT?.quantity.toFixed(2)) + ' ' + nutrients.PROCNT?.unit,
      sugar: Math.round(nutrients.SUGAR?.quantity.toFixed(2)) + ' ' + nutrients.SUGAR?.unit,
      sodium: Math.round(nutrients.NA?.quantity.toFixed(2)) + ' ' + nutrients.NA?.unit,
      cholesterol: Math.round(nutrients.CHOLE?.quantity.toFixed(2)) + ' ' + nutrients.CHOLE?.unit
    };

    return (
        <div>
            <h1>{recipe.recipe.label}</h1>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <p>Cook time: {cookTime}</p>
            <p>{recipe.recipe.cuisineType} - {recipe.recipe.mealType}</p>
            <h4>Ingredients</h4>
            <ul>
                {recipe.recipe.ingredientLines.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
            <h4>Nutrition Information</h4>
            <ul>
                <li>Calories: {nutritionInfo.calories}</li>
                <li>Carbs: {nutritionInfo.carbs}</li>
                <li>Fat: {nutritionInfo.fat}</li>
                <li>Protein: {nutritionInfo.protein}</li>
                <li>Sugar: {nutritionInfo.sugar}</li>
                <li>Sodium: {nutritionInfo.sodium}</li>
                <li>Cholesterol: {nutritionInfo.cholesterol}</li>
            </ul>
            <button onClick={() => window.open(recipe.recipe.url, "_blank")}>Cook recipe</button>

        </div>
    );
}

export default RecipeDetails;