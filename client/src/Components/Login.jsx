import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const AuthForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? 'http://localhost:3000/auth/adminLogin'
      : 'http://localhost:3000/auth/signup';

    try {
      const response = await axios.post(endpoint, values);
      const data = response.data;

      if (isLogin) {
        if (data.loginStatus) {
          localStorage.setItem('token', data.token); // Save JWT token
          setUser({ username: values.username });
          navigate(data.redirect || '/dashboard');
        } else {
          setError('Invalid credentials.');
        }
      } else {
        if (data.signupStatus) {
          alert('Signup successful. Please log in.');
          setIsLogin(true);
          setValues({ username: '', password: '' });
        } else {
          setError(data.message || 'Signup failed.');
        }
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Check if backend is running.');
      } else {
        setError(err.response?.data?.message || 'An error occurred.');
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bgpic1.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Admin Login' : 'Signup'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={values.username}
              onChange={(e) => setValues({ ...values, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="flex flex-col gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              type="submit"
            >
              {isLogin ? 'Admin Login' : 'Signup'}
            </button>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              onClick={() => navigate('/userlogin')}
            >
              User Login
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? 'Signup here' : 'Login here'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
