import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../css/progress.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/buttons.css';

const Progress = () => {
  const [dailyIntake, setDailyIntake] = useState(null);
  const [nutritionGoals, setNutritionGoals] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchData = async () => {
          try {
              const token = localStorage.getItem("token");
              const options = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' };
              const dateUTC = new Date();
              const date = new Date(dateUTC.toLocaleString('en-US', options)).toISOString().split('T')[0];
              console.log(date);

              const intakeResponse = await axios.get(`http://127.0.0.1:5000/nutrition/intake/${date}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if (intakeResponse.data) {
              setDailyIntake(intakeResponse.data);
              } else {
                setDailyIntake({"calories": 0, "carbs": 0, "fat": 0, "protein": 0, "sugar": 0, "sodium": 0, "cholesterol": 0});
              }
              const goalsResponse = await axios.get('http://127.0.0.1:5000/nutrition/goal', {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log("goals", goalsResponse.data);
              if (goalsResponse.data) {
                setNutritionGoals(goalsResponse.data);
              } else {
                console.log("No goals set");
              }
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };

      fetchData();
  }, []);

    console.log(nutritionGoals);
    console.log(dailyIntake);


    const editGoal = () => {
        navigate('/goal');
    };

    const calculateProgress = (intake, goal) => {
      if (goal > 0) {
          return Math.min((intake / goal) * 100, 100);
      }
      return 0;
  };

  const getProgressBarVariant = (intake, goal) => {
    const ratio = goal > 0 ? intake / goal : 0;
    if (ratio > 1) {
        return 'success';
    }
    return 'warning';
};

    return (
    <div>
            <h2 sytyle={{marginTop: 30}}>Nutritional Progress</h2>
            <div>
                {dailyIntake && nutritionGoals ? (
                  <div className="nutrition-list-container">
                    <ul style={{listStyleType: 'none', textAlign: 'left', marginTop: 30}}>
                    <li><strong>Calories: {dailyIntake.calories} / {nutritionGoals.calories} cal</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.calories, nutritionGoals.calories)} 
                        variant={getProgressBarVariant(dailyIntake.calories, nutritionGoals.calories)}
                        label={`${dailyIntake.calories} / ${nutritionGoals.calories} cal`}
                        className='progress-bar'
                    /> <br></br>
                    <li><strong>Protein: {dailyIntake.protein} / {nutritionGoals.protein} g</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.protein, nutritionGoals.protein)} 
                        variant={getProgressBarVariant(dailyIntake.protein, nutritionGoals.protein)}
                        label={`${dailyIntake.protein} / ${nutritionGoals.protein} g`}
                        className='progress-bar'
                    /> <br></br>
                    <li><strong>Carbs: {dailyIntake.carbs} / {nutritionGoals.carbs} g</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.carbs, nutritionGoals.carbs)} 
                        variant={getProgressBarVariant(dailyIntake.carbs, nutritionGoals.carbs)}
                        label={`${dailyIntake.carbs} / ${nutritionGoals.carbs} g`} 
                        className='progress-bar'
                    /> <br></br>
                    <li><strong>Sugar: {dailyIntake.sugar} / {nutritionGoals.sugar} g</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.sugar, nutritionGoals.sugar)} 
                        variant={getProgressBarVariant(dailyIntake.sugar, nutritionGoals.sugar)}
                        label={`${dailyIntake.sugar} / ${nutritionGoals.sugar} g`}
                        className='progress-bar'
                    /> <br></br>
                    <li><strong>Sodium: {dailyIntake.sodium} / {nutritionGoals.sodium} mg</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.sodium, nutritionGoals.sodium)} 
                        variant={getProgressBarVariant(dailyIntake.sodium, nutritionGoals.sodium)}
                        label={`${dailyIntake.sodium} / ${nutritionGoals.sodium} mg`}
                        className='progress-bar'
                    /> <br></br>
                    <li><strong>Cholesterol: {dailyIntake.cholesterol} / {nutritionGoals.cholesterol} mg</strong></li>
                    <ProgressBar 
                        now={calculateProgress(dailyIntake.cholesterol, nutritionGoals.cholesterol)} 
                        variant={getProgressBarVariant(dailyIntake.cholesterol, nutritionGoals.cholesterol)}
                        label={`${dailyIntake.cholesterol} / ${nutritionGoals.cholesterol} mg`}
                        className='progress-bar'
                    />
                    </ul>
                  </div>
                ) :        ( <p>Loading...</p> )}

             
                <button className="grayButton" onClick={editGoal}>Edit Goals</button>
            </div>
          
        </div>
    );
};

export default Progress;