import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
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

    const extractInfo = {
        calories: Math.round(nutrients.ENERC_KCAL?.quantity),
        carbs: Math.round(nutrients.CHOCDF?.quantity.toFixed(2)),
        fat: Math.round(nutrients.FAT?.quantity.toFixed(2)),
        protein: Math.round(nutrients.PROCNT?.quantity.toFixed(2)),
        sugar: Math.round(nutrients.SUGAR?.quantity.toFixed(2)),
        sodium: Math.round(nutrients.NA?.quantity.toFixed(2)),
        cholesterol: Math.round(nutrients.CHOLE?.quantity.toFixed(2))
    }

    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        // Fetch the current favorite status from the backend
        const fetchFavoriteStatus = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/recipe/favorite-status`, {
                    params: { recipeUri: recipe.recipe.uri }, // Assuming `uri` is your unique identifier
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("Response:", response.data.favorited);
                setIsFavorited(response.data.favorited);
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };
        
        fetchFavoriteStatus();
        console.log("Favorited status:", isFavorited);
    }, []);
    

    const handleCookRecipe = async (recipe) => {
        console.log(recipe);
        await axios.post('http://127.0.0.1:5000/recipe', {
            recipe_data: recipe,
            favorited: isFavorited
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        await axios.post('http://127.0.0.1:5000/nutrition/intake', extractInfo, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
        console.log(localStorage.getItem("token"));
        window.open(recipe.recipe.url, "_blank")
    };

    const handleToggleFavorite = async () => {
        const response = await axios.post('http://127.0.0.1:5000/recipe', {
            recipe_data: recipe,
            favorited: !isFavorited  // Toggle the favorite status
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data.favorited);
        setIsFavorited(response.data.favorited);
    };

    const navigateBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <button style={{ position: 'absolute', left: 50, marginTop: 15 }} onClick={navigateBack}>Back</button>
            <h1 style={{ marginTop: 15 }}>{recipe.recipe.label}</h1>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <p>Cook time: {cookTime}</p>
            <p>{recipe.recipe.cuisineType} - {recipe.recipe.mealType}</p>
            <h4>Ingredients</h4>
            <ul style={{listStyleType: 'none'}}>
                {recipe.recipe.ingredientLines.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
            <h4>Nutrition Information</h4>
            <ul style={{listStyleType: 'none'}}>
                <li>Calories: {nutritionInfo.calories}</li>
                <li>Carbs: {nutritionInfo.carbs}</li>
                <li>Fat: {nutritionInfo.fat}</li>
                <li>Protein: {nutritionInfo.protein}</li>
                <li>Sugar: {nutritionInfo.sugar}</li>
                <li>Sodium: {nutritionInfo.sodium}</li>
                <li>Cholesterol: {nutritionInfo.cholesterol}</li>
            </ul>
            <button style={{color: 'orange'}}onClick={() => handleToggleFavorite()}>{isFavorited ? "★" : "☆"}</button>
            <button onClick={() => handleCookRecipe(recipe)}>Cook Recipe</button>

        </div>
    );
}

export default RecipeDetails;