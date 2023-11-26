import React, { useRef } from "react";
import '../css/mainpage.css';
import axios from "axios";
 
import {Link} from 'react-router-dom';

function MainPage(){

  const token = localStorage.getItem('token'); 
    axios.get('http://127.0.0.1:5000/mainpage', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

  return (
    <h1>Generate a recipe!</h1>
  );
  }

export default MainPage;