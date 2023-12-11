import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Favorite() {

    const navigate = useNavigate();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [favorited, setFavorited] = useState(false);
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/recipe/getFav', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
            console.log(response.data);
          setFavoriteRecipes(response.data.reverse());
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      };
  
      fetchRecipes();
    }, []);
  
    const goToRecipeDetails = (recipe) => {
      navigate('/recipeDetails', { state: { recipe } });
    }

    const toggleFavorite = async (recipe, index) => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/recipe', {
            recipe_data: recipe,
            favorited: false
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.status === 200) {
          const updatedFavorites = [...favoriteRecipes];
          updatedFavorites.splice(index, 1);
          setFavoriteRecipes(updatedFavorites);
        }
        console.log('response', response.data.favorited);
        setFavorited(response.data.favorited);

      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    };

  
    return (
      <div>
        <h2 style={{marginTop: 10, marginBottom: 30}}>Favorited Recipes</h2>
        <ul style={{listStyleType: 'none', maxWidth: '30%', margin: '0 auto'}}>
          {favoriteRecipes.map((recipe, index) => (
            <li key={index} style={{ border: '3px black solid', marginBottom: 15, padding: 20, borderRadius: 15, backgroundColor: '#edd980'}}>
              <h4>{recipe.recipe_data.recipe.label}</h4>
              <img style={{maxWidth: 150, border: '2px black solid'}}src={recipe.recipe_data.recipe.image} alt={recipe.recipe_data.recipe.label}/><br></br>
              <button style={{marginTop: 15}}onClick={() => goToRecipeDetails(recipe.recipe_data)}>View details</button>
              <button style={{marginLeft: 10}} onClick={() => toggleFavorite(recipe.recipe_data, index)}>Unfavorite</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
export default Favorite;