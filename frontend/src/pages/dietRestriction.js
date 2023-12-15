import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../css/checkbox.css';
import '../css/buttons.css';
import { set } from "date-fns";

function DietRestriction() {

    const restrictions = ["alcohol-free", "celery-free", "crustcean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "keto-friendly", "kidney-friendly", "khoser", "low-fat", "low-potassium", "low-sugar", "lupine-free", "Mediterranean", "mollusk-free", "no-oil-added", "paleo", "peanut-free", "pescatarian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]; // Add more as needed
    const [selectedRestrictions, setSelectedRestrictions] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setStatusMessage('');
        const fetchAndSetRestrictions = async () => {
          try {
            const restrictions = await fetchRestrictions();
            setSelectedRestrictions(restrictions);
          } catch (error) {
            console.error("Error fetching restrictions:", error);
          }
        };
    
        fetchAndSetRestrictions();
      }, []);

      const fetchRestrictions = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/restrictions/get", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response.data;
        }
          catch (error) {
            console.error("Error fetching restrictions:", error);
            return [];
        }
      };


    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setSelectedRestrictions(prev =>
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        console.log(selectedRestrictions);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setStatusMessage('Updated restrictions successfully');
        axios.post('http://127.0.0.1:5000/restrictions/update', {
            restrictions: selectedRestrictions
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            console.log("Restrictions updated:", response.data);
        }).catch(error => {
            console.error("Error updating restrictions:", error);
        });
    };


    return (
        <div>
            <h2 style={{ marginBottom: 20, marginTop: 15 }}>Select Your Dietary Restrictions</h2>
            <div className="checkbox-container">
                {restrictions.map(option => (
                    <div className="checkbox-item" key={option}>
                        <input
                            type="checkbox"
                            value={option}
                            onChange={handleCheckboxChange}
                            checked={selectedRestrictions.includes(option)}
                            id={option}
                        />
                        <label htmlFor={option}>{option}</label>
                    </div>
                ))}
            </div>
            {statusMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>{statusMessage}</div>
      )}
            <button className="green-button" style={{ justifyContent: 'center', marginTop: 15 }} onClick={handleSubmit}>Update Restrictions</button>
        </div>
    );
};

export default DietRestriction;