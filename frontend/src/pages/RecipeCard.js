import '../css/recipeCard.css';
import { useNavigate } from 'react-router-dom';
import '../css/buttons.css';

function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const cookTime = recipe.recipe.totalTime === 0 ? "Fast" : `${recipe.recipe.totalTime} minutes`;

    return (
      <div className="recipe-card">
        <h4>{recipe.recipe.label}</h4>
        <img style={{maxWidth: '60%'}}src={recipe.recipe.image} alt={recipe.recipe.label} />
        <p>Cook time: {cookTime}</p>
        <p>{recipe.recipe.cuisineType}</p>
        <p>{recipe.recipe.mealType}</p>
        <button className="grayButton" onClick={() => navigate('/recipeDetails', { state: { recipe: recipe } })}>View details</button>
      </div>
    );
  }
  
export default RecipeCard;