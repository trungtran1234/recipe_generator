import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
 
export default function RegisterPage(){
 
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState(null);
   
    const navigate = useNavigate();
     
    const registerUser = () => {
        axios.post('http://127.0.0.1:5000/register', {
            username: username,
            password: password
        })
        .then(function (response) {
             console.log(response);
            navigate("/mainpage");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response?.status === 402) {
                setError("Username already exists");
            }
        });
    };
     
    let imgs = [
        'https://drive.google.com/uc?id=1mZUqACEgvmxyBZqWnib_bFRfd6PLBvzW',
    ];
     
  return (
    <div>
        <div className="container h-100">
          <div className="container-fluid h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
                <img alt='logo' src={imgs[0]} className="img-fluid"/>
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                    <p className="fs-4"><strong>Welcome</strong></p>
                  <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="fs-6 fw-normal mb-20 me-3">Create an account</p>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
 
                  <div className="form-outline mb-4 mt-20">
                    <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} id="form3Example3" className="form-control form-control-lg" placeholder="Enter username" />
                  </div>
 
             
                  <div className="form-outline mb-3">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form3Example4" className="form-control form-control-lg" placeholder="Enter password" />
                  </div>
 
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="button" className="btn btn-success btn-md" onClick={() => registerUser()} >Sign Up</button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="/" className="link-success">Sign In</a></p>
                  </div>
 
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}