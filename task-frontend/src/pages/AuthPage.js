import React, { useState } from 'react';
import '../pages/AuthPage.css';

const AuthPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (success) {
      // Add success logic if needed
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('❌ Passwords do not match.');
      return;
    }
    const success = onSignup(email, password);
    if (success) {
      setIsLogin(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          )}
          <button type="submit" className="button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="toggleButton"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;