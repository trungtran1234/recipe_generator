import React, { useState, useEffect } from "react";
import '../css/mainpage.css';
import axios from 'axios';

const categories = ["Vegetable", "Dairy", "Fruit", "Grain", "Protein", "Other"];

const fetchPantryItems = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/pantry", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    return [];
  }
};

export const addPantryItem = async (ingredientName, quantity, unit, category) => {
  try {
    const response = await axios.post(`http://127.0.0.1:5000/pantry`, {
      ingredient_name: ingredientName,
      quantity: quantity,
      unit: unit,
      category: category
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.data === 'Ingredient already in pantry') {
      return null;
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return { error: error.response.data.message };
    }
    throw error;
  }
};

const fetchSuggestions = async (query, setSuggestionsCallback) => {
  if (!query) return [];

  const options = {
    method: 'GET',
    url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/auto-complete',
    params: { q: query, limit: '5' },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
      "X-RapidAPI-Host": "edamam-food-and-grocery-database.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    setSuggestionsCallback(response.data);
  }
  catch (error) {
    console.error('Error fetching ingredient suggestions:', error);
    return [];
  }
};

const debounce = (func, delay) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

const fetchFoodId = async (ingredientName) => {
  try {
    const response = await axios.get('https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser', {
      params: {
        ingr: ingredientName,
      },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
      }
    });
    const foodId = response.data.hints[0]?.food?.foodId;
    const foodImg = response.data.hints[0]?.food?.image;
    console.log(foodId);
    return { foodId, foodImg };
  } catch (error) {
    console.error('Error fetching foodId:', error);
    return null;
  }
};

const Pantry = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [foodImg, setFoodImg] = useState(null);

  const measureURIMap = {
    "oz": "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce",
    "g": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
    "lb": "http://www.edamam.com/ontologies/edamam.owl#Measure_pound",
    "kg": "http://www.edamam.com/ontologies/edamam.owl#Measure_kilogram",
    "pinch": "http://www.edamam.com/ontologies/edamam.owl#Measure_pinch",
    "L": "http://www.edamam.com/ontologies/edamam.owl#Measure_liter",
    "fl oz": "http://www.edamam.com/ontologies/edamam.owl#Measure_fluid_ounce",
    "gal": "http://www.edamam.com/ontologies/edamam.owl#Measure_gallon",
    "pt": "http://www.edamam.com/ontologies/edamam.owl#Measure_pint",
    "qt": "http://www.edamam.com/ontologies/edamam.owl#Measure_quart",
    "mL": "http://www.edamam.com/ontologies/edamam.owl#Measure_milliliter",
    "drop": "http://www.edamam.com/ontologies/edamam.owl#Measure_drop",
    "cup": "http://www.edamam.com/ontologies/edamam.owl#Measure_cup",
    "tbsp": "http://www.edamam.com/ontologies/edamam.owl#Measure_tablespoon",
    "tsp": "http://www.edamam.com/ontologies/edamam.owl#Measure_teaspoon"
  };

  const groupByCategory = (items) => {
    return items.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    const loadPantryItems = async () => {
      const items = await fetchPantryItems();
      const groupedItems = groupByCategory(items);
      setPantryItems(groupedItems);
    };

    loadPantryItems();
  }, []);

  const handleIngredientChange = async (e) => {
    const value = e.target.value;
    setIngredientName(value);
    setIsIngredientSelected(false);
    if (value.length >= 2) {
      debouncedFetchSuggestions(value, setSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAutocompleteClick = async (suggestion) => {
    setIngredientName(suggestion);
    setSuggestions([]);
    setIsIngredientSelected(true);
    const { measures } = await fetchFoodId(suggestion);
    const hasUnitMeasure = measures.some(measure => measure.uri === "http://www.edamam.com/ontologies/edamam.owl#Measure_unit");
    setHasUnitMeasure(hasUnitMeasure);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(' ');

    if (!ingredientName || !quantity || !unit || !category) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    const numericQuantity = Number(quantity);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      setErrorMessage('Quantity must be a number');
      return;
    }

    const newItem = await addPantryItem(ingredientName, quantity, unit, category);
    if (newItem && newItem.error) {
      setErrorMessage(newItem.error);
      return;
    }
    if (newItem) {
      setPantryItems(prevItems => {
        const updatedItems = { ...prevItems };
        if (!updatedItems[category]) {
          updatedItems[category] = [];
        }
        updatedItems[category].push(newItem);
        return updatedItems;
      });
    }
    setIngredientName('');
    setQuantity('');
    setUnit('');
    setCategory('');
  };

  const handleItemSelection = async (selectedItem) => {
    const {foodId, foodImg } = await fetchFoodId(selectedItem.ingredient_name);
    const measureURI = measureURIMap[selectedItem.unit.toLowerCase()];
    console.log(measureURI);
    console.log(selectedItem.ingredient_name);
    console.log(selectedItem.unit.toLowerCase());
    console.log('https://api.edamam.com/api/food-database/v2/nutrients?' + 'app_id=' + process.env.REACT_APP_FOODAPI_ID + '&app_key=' + process.env.REACT_APP_FOODAPI_KEY);
    setSelectedItem(selectedItem.ingredient_name);
    setSelectedQuantity(selectedItem.quantity);
    setSelectedUnit(selectedItem.unit);
    if (foodId && measureURI) {
      try {
        const response = await axios.post('https://api.edamam.com/api/food-database/v2/nutrients?' + 'app_id=' + process.env.REACT_APP_FOODAPI_ID + '&app_key=' + process.env.REACT_APP_FOODAPI_KEY, {
          ingredients: [
            {
              quantity: selectedItem.quantity,
              measureURI: measureURI,
              foodId: foodId
            }
          ]
        }, {
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
          }
        });
        setNutritionInfo(response.data);
        setFoodImg(foodImg);
      } catch (error) {
        console.error('Error fetching nutrition info:', error);
        setNutritionInfo(null);
      }
    } else {
      console.error('FoodId not found for ingredient');
      setNutritionInfo(null);
    }
  };

  const deletePantryItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/pantry/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedItems = await fetchPantryItems();
      setPantryItems(groupByCategory(updatedItems));
    } catch (error) {
      console.error('Error deleting pantry item:', error);
    }
  };


  const extractNutritionInfo = (data) => {
    return {
      calories: Math.round(data.totalNutrients.ENERC_KCAL?.quantity),
      carbs: Math.round(data.totalNutrients.CHOCDF?.quantity),
      fat: Math.round(data.totalNutrients.FAT?.quantity),
      protein: Math.round(data.totalNutrients.PROCNT?.quantity),
      sugar: Math.round(data.totalNutrients.SUGAR?.quantity),
      sodium: Math.round(data.totalNutrients.NA?.quantity),
      cholesterol: Math.round(data.totalNutrients.CHOLE?.quantity)
    };
  };

const toggleFavorite = async (itemId, isFavorite) => {
  try {
    await axios.patch(`http://127.0.0.1:5000/pantry/${itemId}/favorite`, {
      favorite: !isFavorite
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const updatedItems = await fetchPantryItems();
    setPantryItems(groupByCategory(updatedItems));
  } catch (error) {
    console.error('Error updating favorite status:', error);
  }
};

  return (
    <div>
      <h1 style={{ marginBottom: '35px' }}>My Pantry</h1>
      <h5 style={{ marginBottom: '10px' }}>Add ingredient</h5>

      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input style={{ marginRight: 10, width: 175 }}
            type="text"
            value={ingredientName}
            onChange={handleIngredientChange}
            placeholder="Ingredient name"
          />
          {suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              boxShadow: '0px 4px 5px rgba(0,0,0,0.2)',
              margin: 0,
              padding: 0,
              listStyleType: 'none',
              borderTop: '1px solid #ddd'
            }}>

              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  style={{ padding: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setIngredientName(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <input style={{ marginRight: 10, width: 70 }}
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <select style={{ marginRight: 10, height: 30 }}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">Select Unit</option>
            <option value="g">Gram</option>
            <option value="oz">Ounce</option>
            <option value="lb">Pound</option>
            <option value="kg">Kilogram</option>
            <option value="pinch">Pinch</option>
            <option value="L">Liter</option>
            <option value="fl oz">Fluid ounce</option>
            <option value="gal">Gallon</option>
            <option value="pt">Pint</option>
            <option value="qt">Quart</option>
            <option value="mL">Mililiter</option>
            <option value="drops">Drop</option>
            <option value="cup">Cup</option>
            <option value="tbsp">Tablespoon</option>
            <option value="tsp">Teaspoon</option>

          </select>
          <select style={{ marginRight: 10, height: 30 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Dairy">Dairy</option>
            <option value="Fruit">Fruit</option>
            <option value="Grain">Grain</option>
            <option value="Protein">Protein</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Add</button>
        </div>
      </form>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '1000px', marginTop: '25px', border: '1px solid black' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            {categories.map(category => (
              <div key={category}>
                <h4 style={{ borderTop: '1px solid black' }}>{category}</h4>
                {pantryItems[category] && pantryItems[category].map((item, index) => (
                  <div key={index} style={{ display: 'inline-block', margin: '5px', border: '1px solid black', borderRadius: '5px' }}>
                    <button onClick={() => deletePantryItem(item.id)}
                            style={{ display: 'inline'}}>X</button>
                    <div onClick={() => handleItemSelection(item)}
                         style={{ padding: '10px', cursor: 'pointer', display: 'inline' }}>
                      {item.ingredient_name} - {item.quantity} {item.unit}
                    </div>
                    <button onClick={() => toggleFavorite(item.id, item.favorite)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
          {item.favorite ? '★' : '☆'}
        </button>
          
                  </div>
                ))}
              </div>
            ))}
          </div>

          {nutritionInfo && (
            <div style={{ width: '300px', border: '1px solid black' }}>
              <h4 style={{ borderBottom: '1px solid black' }}>Nutrition Information</h4>
              <img alt='food image' src={foodImg} style={{maxWidth: '50%', height: 'auto'}}/>
              <h5><strong>{selectedItem} - {selectedQuantity} {selectedUnit}</strong></h5><br></br>
              <p>Calories: {extractNutritionInfo(nutritionInfo).calories} kcal</p>
              <p>Carbs: {extractNutritionInfo(nutritionInfo).carbs} g</p>
              <p>Fat: {extractNutritionInfo(nutritionInfo).fat} g</p>
              <p>Protein: {extractNutritionInfo(nutritionInfo).protein} g</p>
              <p>Sugar: {extractNutritionInfo(nutritionInfo).sugar} g</p>
              <p>Sodium: {extractNutritionInfo(nutritionInfo).sodium} mg</p>
              <p>Cholesterol: {extractNutritionInfo(nutritionInfo).cholesterol} mg</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pantry;