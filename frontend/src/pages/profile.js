import React from "react";
import '../css/mainpage.css'; 
import {useNavigate} from 'react-router-dom';

function Profile({ removeToken }){
    const navigate = useNavigate();

    const logMeOut = () => {
        removeToken();
        navigate('/');
    };

    return (
        <div>
            <h1>Profile</h1>
            <button onClick={logMeOut}>Logout</button>
        </div>
    );
}

export default Profile;