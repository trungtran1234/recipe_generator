import React, { } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MainPage from './pages/mainpage';
import NavBar from './pages/navbar';
import dietRestriction from './pages/dietRestriction';
import progress from './pages/progress';
import pantry from './pages/pantry';
import history from './pages/history';
import profile from './pages/profile';

function App() {
  return (
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mainpage" element={<MainPage />} /> 
            <Route path="/dietRestriction" element={<dietRestriction />} /> 
            <Route path="/progress" element={<progress />} /> 
            <Route path="/pantry" element={<pantry />} /> 
            <Route path="/history" element={<history />} /> 
            <Route path="/profile" element={<profile />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
