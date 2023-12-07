import React, { useState, useEffect } from "react";
import "../css/mainpage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [recipeTime, setRecipeTime] = useState("");
  const [pantryItems, setPantryItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recipes, setRecipes] = useState(null);

  const handleCheckboxChange = async (item, isChecked) => {
    try {
      console.log(+isChecked);
      await axios.patch(`http://127.0.0.1:5000/mainpage/select`,
        {
          ingredient_name: item.ingredient_name,
          selected: +isChecked
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedItems = pantryItems.map((i) => {
        if (i.ingredient_name === item.ingredient_name) {
          return { ...i, selected: +isChecked };
        }
        return i;
      });
      setPantryItems(updatedItems);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const updateBackendSelectedStatus = async (itemIds, selectedStatus) => {
    console.log(itemIds);
    try {
      await axios.patch('http://127.0.0.1:5000/mainpage/bulk-update', {
        item_ids: itemIds,
        selected: selectedStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const selectAllItems = () => {
    const updatedItems = pantryItems.map(item => ({ ...item, selected: 1 }));
    setPantryItems(updatedItems);

    const itemIds = pantryItems.map(item => item.id);
    updateBackendSelectedStatus(itemIds, 1);
    console.log(itemIds);
  };

  const clearAllItems = () => {
    const updatedItems = pantryItems.map(item => ({ ...item, selected: 0 }));
    setPantryItems(updatedItems);

    const itemIds = pantryItems.map(item => item.id);
    updateBackendSelectedStatus(itemIds, 0);
    console.log(itemIds);

  };

  const fetchPantryItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/pantry", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching pantry item names:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadPantryItems = async () => {
      const items = await fetchPantryItems();
      setPantryItems(items);
    };

    loadPantryItems();
  }, []);

  const generateRecipe = async () => {
    const selectedIngredients = pantryItems
      .filter(item => item.selected === 1)
      .map(item => item.ingredient_name);

      if (selectedIngredients.length === 0) {
        setErrorMessage("Please select at least one ingredient");
        return;
      }
      if (course === '' || cuisine === '' || recipeTime === '') {
        setErrorMessage("Please select all options");
        return;
      }
      
      const fields = ['image', 'source', 'dietLabels', 'ingredients', 'ingredientLines', 'totalTime', 'cuisineType', 'mealType', 'totalNutrients', 'url', 'label'];
      const ingredientsQuery = selectedIngredients.join(', ');
      const params = {
      q: ingredientsQuery,
      type: 'public',
      app_id: process.env.REACT_APP_RECIPE_API_ID,
      app_key: process.env.REACT_APP_RECIPE_API_KEY,
      ingr: selectedIngredients.length + 1,
      imageSize: 'SMALL',
    };
    if (course !== 'any') {
      params.mealType = course;
    }
    if (cuisine !== 'any') {
      params.cuisineType = cuisine;
    }
    if (recipeTime !== 'any') {
      if (recipeTime === '5 minutes or less') {
        params.time = 5;
      } else if (recipeTime === '10 minutes or less') {
        params.time = 10;
      } else if (recipeTime === '30 minutes or less') {
        params.time = 30;
      } else if (recipeTime === '1 hour or less') {
        params.time = 60;
      } else if (recipeTime === '1 hour or more') {
        params.time = '60%2B';
      }
    }
    console.log(params);
    try {
      const response = await axios.get("https://api.edamam.com/api/recipes/v2?"
      + "app_id=" +
      process.env.REACT_APP_RECIPE_API_ID +
      "&app_key=" +
      process.env.REACT_APP_RECIPE_API_KEY +
      '&field=' + fields[0] +
      '&field=' + fields[1] +
      '&field=' + fields[2] +
      '&field=' + fields[3] +
      '&field=' + fields[4] +
      '&field=' + fields[5] +
      '&field=' + fields[6] +
      '&field=' + fields[7] +
      '&field=' + fields[8] +
      '&field=' + fields[9] +
      '&field=' + fields[10], { params });
      console.log(response.data);
      setRecipes(response.data.hits);
      if (response.data.count === 0) {
        setErrorMessage("No recipes found for the specified requirements");
        return;
      }
      navigate("/recipe", { state: { recipes: response.data.hits } });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  

  return (
    <div>
      <h1 style={{ marginBottom: 40, marginTop: 20 }}>Welcome!</h1>
      <h2 style={{ marginBottom: 40 }}>Generate a Recipe:</h2>
      {errorMessage && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
      )}
      <select
        style={{ marginRight: 10, height: 30 }}
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        <option value="any">Any</option>
        <option value="breakfast">Breakfast</option>
        <option value="dinner">Dinner</option>
        <option value="lunch">Lunch</option>
        <option value="snack">Snack</option>
        <option value="teatime">Tea time</option>
      </select>

      <select
        style={{ marginRight: 10, height: 30 }}
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
      >
        <option value="">Select Cuisine</option>
        <option value="any">Any</option>
        <option value="American">American</option>
        <option value="South American">South American</option>
        <option value="Mediterranean">Mediterranean</option>
        <option value="Caribbean">Caribbean</option>
        <option value="British">British</option>
        <option value="Centrap Europe">Central Europe</option>
        <option value="Easter Europe">Eastern Europe</option>
        <option value="Khoser">Khoser</option>
        <option value="French">French</option>
        <option value="Italian">Italian</option>
        <option value="Middle Eastern">Middle Eastern</option>
        <option value="Mexican">Mexican</option>
        <option value="Asian">Asian</option>
        <option value="South East Asian">South East Asian</option>
        <option value="Chinese">Chinese</option>
        <option value="Indian">Indian</option>
        <option value="Japanese">Japanese</option>
        <option value="Nordic">Nordic</option>
      </select>

      <select
        style={{ marginRight: 10, height: 30 }}
        value={recipeTime}
        onChange={(e) => setRecipeTime(e.target.value)}
      >
        <option value="">Time for Recipe</option>
        <option value="any">Any</option>
        <option value="5 minutes or less">5 minutes or less</option>
        <option value="10 minutes or less">10 minutes or less</option>
        <option value="30 minutes or less">30 minutes or less</option>
        <option value="1 hour or less">1 hour or less</option>
        <option value="1 hour or more">1 hour or more</option>
      </select>

      <div className="list">
        <h5 className="title" style={{ marginTop: 10 }}>
          Your pantry items:
        </h5>
        <div className="form-check">
          <div style = {{marginRight: '20px'}}>
            <button style = {{marginRight: '10px'}}onClick={selectAllItems}>Select All</button>
            <button onClick={clearAllItems}>Clear All</button>
          </div>
          <table width="100%" align="center">
            <tbody>
              {pantryItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        checked={item.selected === 1}
                        onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                        <span>&nbsp;&nbsp;&nbsp;{item.ingredient_name} ({item.quantity} {item.unit})</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generateRecipe}>Generate Recipe</button>
        </div>
      </div>
    </div>

  );
}

export default MainPage;