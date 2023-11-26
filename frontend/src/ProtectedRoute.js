import React from 'react';
import { Navigate } from 'react-router-dom';
import useToken from './useToken';

function ProtectedRoute({ children }) {
    const { token } = useToken();

    if (!token) {
        // User not authenticated, redirect to login page
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
