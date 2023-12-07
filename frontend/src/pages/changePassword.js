import React, { useState } from "react";
import axios from 'axios';


  function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
  
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
          console.log('Password changed successfully!');
        } else {
          console.error('Error changing password');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    return (
      <div>
        <label>
          Enter new password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    );
  }
  
  export default ChangePassword;