import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/profile.css';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/changePassword',
        { new_password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Response:', response.status, response.statusText);

      if (response.status === 200) {
        setStatusMessage('Password changed successfully!');
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
      <h2>Change Password</h2>
      <label className="label">
        Enter new password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
        />
      </label>
      <button onClick={handleChangePassword} className="button">
        Change Password
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

export default ChangePassword;