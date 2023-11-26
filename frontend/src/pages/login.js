import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
 
export default function LoginPage({ setToken }){
 
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
     
    const logInUser = () => {
        if(username.length === 0){
          alert("Username has left Blank!");
        }
        else if(password.length === 0){
          alert("Password has left Blank!");
        }
        else{
            axios.post('http://127.0.0.1:5000/login', {
                username: username,
                password: password
            })
            .then(function (response) {
                localStorage.setItem('token', response.data.access_token);  // Store the token
                setError(null);
                navigate("/mainpage");
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response?.status === 400) {
                    setError("Invalid username");
                }
                if (error.response?.status === 401) {
                  setError("Invalid password");
              }
            });
        }
    }

    let imgs = [
      'https://drive.google.com/uc?id=1mZUqACEgvmxyBZqWnib_bFRfd6PLBvzW',
    ];
     
  return (
    <div>
        <div className="container h-100">
          <div className="container-fluid h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
                <img src={imgs[0]} className="img-fluid"/>
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                  <p className="fs-4"><strong>Welcome Back</strong></p>
                  <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="fw-normal mb-4 me-3">Sign in with your username and password.</p>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
 
                  <div className="form-outline mb-4">
                    <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} id="form3Example3" className="form-control form-control-lg" placeholder="Enter username" />
                  </div>
 
             
                  <div className="form-outline mb-3">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form3Example4" className="form-control form-control-lg" placeholder="Enter password" />
                  </div>
 
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="button" className="btn btn-success btn-md" onClick={logInUser} >Sign In</button>
                    <p className="small fw-bold mt-5 mb-10">Don't have an account? <a href="/register" className="link-success">Sign up</a></p>
                    <p className="small fw-normal mt-2 mb-0"><a href="/aboutUs" className="link-primary">Click</a> to know more about us! </p>
                  </div>

              
 
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}