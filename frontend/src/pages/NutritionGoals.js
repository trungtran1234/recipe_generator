import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/buttons.css';
import '../css/goal.css';

const NutritionGoals = () => {
    const [goals, setGoals] = useState({
        weight: 0, calories: 0, carbs: 0, fat: 0, protein: 0, sugar: 0, sodium: 0, cholesterol: 0
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://127.0.0.1:5000/nutrition/goal', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setGoals(response.data); 
                }
            } catch (error) {
                console.error("Error fetching goals:", error);
            }
        };

        fetchGoals();
    }, []);

    const handleChange = (e) => {
        setGoals({ ...goals, [e.target.name]: parseInt(e.target.value, 10) || 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(goals)
            const response = await axios.post('http://127.0.0.1:5000/nutrition/goal', 
                goals, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            navigate('/progress');
          } catch (error) {
            console.error("Erorr updating goal:", error);
          }
        };

        const goBack = () => {
            navigate(-1);
        };

    return (
        <div>
            <button style={{marginTop: 20, marginBottom: 15}} className="grayButton" onClick={goBack}>Back</button>

            <h2>Set Your Nutrition Goals</h2>
            <form onSubmit={handleSubmit}>
                Calories Goal: <input type="number" name="calories" value={goals.calories} onChange={handleChange} /> calories <br /><br></br>
                Protein Goal: <input type="number" name="protein" value={goals.protein} onChange={handleChange} /> g <br /><br></br>
                Carbs Goal: <input type="number" name="carbs" value={goals.carbs} onChange={handleChange} /> g<br /><br></br>
                Sugar Goal: <input type="number" name="sugar" value={goals.sugar} onChange={handleChange} /> g<br /><br></br>
                Sodium Goal: <input type="number" name="sodium" value={goals.sodium} onChange={handleChange} /> mg<br /><br></br>
                Cholesterol Goal: <input type="number" name="cholesterol" value={goals.cholesterol} onChange={handleChange} /> mg<br />

                <button style={{marginTop: 20}}className="green-button" type="submit">Save Goals</button>
            </form>
        </div>
    );
};

export default NutritionGoals;