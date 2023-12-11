import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/profile.css';

function ChangeUsername() {
  const [newUsername, setNewUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();


  const handleChangeUsername = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/changeUsername',
        { new_Username: newUsername },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      console.log('Response:', response.status, response.statusText);
  
      if (response.status === 200) {
        setStatusMessage('Username changed successfully!');
      } else {
        setStatusMessage('Error changing password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const navigateBack = () => {
    navigate('/profile');
  };

  return (
    <div className="editContainer">
      <h2>Change Username</h2>
      <label className="label">
        Enter new username:
        <input
          type="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="input"
        />
      </label>
      <button onClick={handleChangeUsername} className="button">
        Change Username
      </button>
      <p className={statusMessage.includes('Error') ? 'errorMessage' : 'successMessage'}>
        {statusMessage}
      </p>
      <button onClick={navigateBack} className="backButton">
        Back to Profile
      </button>
    </div>
  );
}
  

export default ChangeUsername;