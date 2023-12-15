import React from "react";
import {useNavigate} from 'react-router-dom';
import '../css/profile.css';

function Profile({ removeToken }) {
  const navigate = useNavigate();

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
      <button onClick={changePagePass} className="button" style={{marginRight: 10}}>Edit Password</button>
      <button onClick={changePageUser} className="button">Edit Username</button><br></br>
      <button onClick={logMeOut} className="backButton">Logout</button>
    </div>
  );
};

export default Profile;