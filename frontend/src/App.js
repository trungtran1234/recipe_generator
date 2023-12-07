import React, { } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MainPage from './pages/mainpage';
import NavBar from './pages/navbar';
import DietRestriction from './pages/dietRestriction';
import Progress from './pages/progress';
import Pantry from './pages/pantry';
import History from './pages/history';
import Profile from './pages/profile';
import useToken from './useToken';
import ProtectedRoute from './ProtectedRoute';
import ChangePassword from './pages/changePassword';
import Recipe from './pages/recipe';
import RecipeDetails from './pages/recipeDetails';

function App() {
  const { removeToken, setToken } = useToken();
  return (
    <BrowserRouter>
            <LayoutWithConditionalNavBar />
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage setToken={setToken} />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/mainpage" element={<ProtectedRoute> <MainPage /> </ProtectedRoute>} />
                    <Route path="/dietRestriction" element={<ProtectedRoute> <DietRestriction /> </ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute> <Progress /> </ProtectedRoute>} />
                    <Route path="/pantry" element={<ProtectedRoute> <Pantry /> </ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute> <History /> </ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile removeToken={removeToken} /></ProtectedRoute>} />
                    <Route path="/changePassword" element ={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
                    <Route path="/recipe" element ={<ProtectedRoute> <Recipe /> </ProtectedRoute>} />
                    <Route path="/recipeDetails" element ={<ProtectedRoute> <RecipeDetails /> </ProtectedRoute>} />

                </Routes>
            </div>
        </BrowserRouter>
    );
}
function LayoutWithConditionalNavBar() {
  const location = useLocation();
  const showNavBar = !['/', '/register'].includes(location.pathname);

  return (
      <>
          {showNavBar && <NavBar />}
      </>
  );
}

export default App;