import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/buttons.css';

function History() {

  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/recipe/get', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRecipes(response.data.reverse());
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const goToRecipeDetails = (recipe) => {
    navigate('/recipeDetails', { state: { recipe } });
  }

  return (
    <div>
      <h2 style={{marginTop: 10, marginBottom: 30}}>Recipe History</h2>
      <ul style={{listStyleType: 'none', maxWidth: '30%', margin: '0 auto'}}>
        {recipes.map((recipe, index) => (
          <li key={index} style={{ border: '3px black solid', marginBottom: 15, padding: 20, borderRadius: 15, backgroundColor: '#69b869'}}>
            <h4>{recipe.recipe_data.recipe.label}</h4>
            <img style={{maxWidth: 150, border: '2px black solid'}}src={recipe.recipe_data.recipe.image} alt={recipe.recipe_data.recipe.label}/><br></br>
            <button className='grayButton' style={{marginTop: 15}}onClick={() => goToRecipeDetails(recipe.recipe_data)}>View details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;