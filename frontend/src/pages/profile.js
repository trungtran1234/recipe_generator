import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import '../css/profile.css';
import axios from 'axios';


function Profile({ removeToken }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setUsername(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUsername();
  }, []);

  const logMeOut = () => {
    removeToken();
    navigate('/');
  };

  const navigatePass = useNavigate();
  const changePagePass = () => {
    navigate('/changePassword');
  };

  const navigateUser = useNavigate();
  const changePageUser = () => {
    navigate('/changeUsername');
  };

  return (
    <div className="editContainer">
      <h1>Profile</h1><br></br>
      <h2>Username: {username}</h2><br></br>
      <button onClick={changePagePass} className="button" style={{marginRight: 10}}>Edit Password</button>
      <button onClick={changePageUser} className="button">Edit Username</button><br></br>
      <button onClick={logMeOut} className="backButton">Logout</button>
    </div>
  );
};

export default Profile;