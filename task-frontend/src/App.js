import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]); 

  const handleSignup = (email, password) => {
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      alert('❌ User already exists!');
      return false;
    }

    setUsers([...users, { email, password }]);
    alert('✅ Signup successful. Now you can login.');
    return true;
  };

  const handleLogin = (email, password) => {
    const found = users.find(user => user.email === email && user.password === password);
    if (found) {
      setIsAuthenticated(true);
      return true;
    } else {
      alert('❌ Invalid credentials or user not registered.');
      return false;
    }
  };

  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            !isAuthenticated ? (
              <AuthPage onLogin={handleLogin} onSignup={handleSignup} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
