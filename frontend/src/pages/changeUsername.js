import React, { useState } from "react";
import axios from 'axios';

function ChangeUsername() {
  const [newUsername, setNewUsername] = useState('');

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
        console.log('Username changed successfully!');
      } else {
        console.error('Error changing Username');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <label>
        Enter new username:
        <input
          type="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </label>
      <button onClick={handleChangeUsername}>Change Username</button>
    </div>
  );
}

export default ChangeUsername;