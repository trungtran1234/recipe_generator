import React, { useState, useEffect } from "react";
import '../css/mainpage.css';
import axios from 'axios';

const fetchPantryItems = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/pantry', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    return [];
  }
};

export const addPantryItem = async (ingredientName, quantity, unit, category) => {
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
  return response.data;
};

const fetchSuggestions = async (query, setSuggestionsCallback) => {
  if (!query) return [];

  const options = {
    method: 'GET',
    url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/auto-complete',
    params: { q: query, limit: '5'},
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
    }
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
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

const Pantry = () => {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    const loadPantryItems = async () => {
      const items = await fetchPantryItems();
      setPantryItems(items);
    };

    loadPantryItems();
  }, []);

  const handleIngredientChange = async (e) => {
    const value = e.target.value;
    setIngredientName(value);
    if (value.length >= 2) {
      debouncedFetchSuggestions(value, setSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPantryItem(ingredientName, quantity, unit, category);
    setIngredientName('');
    setQuantity('');
    setUnit('');
    setCategory('');

    const items = await fetchPantryItems();
    setPantryItems(items);
  };

  return (
    <div>
      <h1 style={{marginBottom: 35}}>My Pantry</h1>
      <h5 style={{marginBottom: 10}}>Add ingredient</h5>

      <form onSubmit={handleSubmit}>
      <div style={{ position: 'relative'}}>
        <input style={{ marginRight: 10, width: 175}}
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
        <input style={{ marginRight: 10, width: 70}}
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <select style={{ marginRight: 10, height: 30}}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="">Select Unit</option>
          <option value={ingredientName}>{ingredientName}</option>
          <option value="g">Gram</option>
          <option value="oz">Ounce</option>
          <option value="lb">Pound</option>
          <option value="kg">Kilogram</option>
          <option value="pinch">Pinch</option>
          <option value="L">Liter</option>
          <option value="fl oz">Fluid ounce</option>
          <option value="gal">Gallon</option>
          <option value="pt">Pint</option>
          <option value="mL">Mililiter</option>
          <option value="drops">Drop</option>
          <option value="cup">Cup</option>
          <option value="tbsp">Tablespoon</option>
          <option value="tsp">Teaspoon</option>

        </select>
        <select  style={{ marginRight: 10,  height: 30}}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="vegetable">Vegetable</option>
          <option value="dairy">Dairy</option>
          <option value="fruit">Fruit</option>
          <option value="grain">Grain</option>
          <option value="protein">Protein</option>
        </select>
        <button type="submit">Add</button>
        </div>
      </form>
      <h3 style={{marginTop: 50}}>Pantry Items</h3>
      <ul>
        {pantryItems.map((item, index) => (
          <li key={index}>{`${item.ingredient_name} - ${item.quantity} ${item.unit}`}</li>
        ))}
      </ul>
    </div>
          
  );
};

export default Pantry;
