import React, { } from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MainPage from './pages/mainpage';


function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mainpage" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
