import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api';

export default function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const token = authService.getToken();
      if (!token) {
        if (isMounted) {
          setAuthState({ isLoading: false, isAuthenticated: false });
        }
        return;
      }

      try {
        await authService.getMe();
        if (isMounted) {
          setAuthState({ isLoading: false, isAuthenticated: true });
        }
      } catch (err) {
        authService.logout();
        if (isMounted) {
          setAuthState({ isLoading: false, isAuthenticated: false });
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.isLoading) {
    // Blank white background while validating JWT
    return <div className="min-h-screen bg-white" />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

