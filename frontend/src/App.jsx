// src/App.js
import React, { useState } from 'react';
import UrlForm from './components/UrlForm';
import UrlInfo from './components/UrlInfo';
import Redirect from './components/Redirect';

import { Routes, Route } from 'react-router-dom';

import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Register from './components/auth/register';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

const App = () => {
  const [url, setUrl] = useState(null);
  const { currentUser } = useAuth();
  const isLoggedIn = currentUser ? currentUser.email : 'Guest';


  // const handleSubmit = async (originalUrl) => {
  //   try {
  //     const response = await fetch('http://localhost:8000/shorten', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ originalUrl }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to shorten URL');
  //     }

  //     const data = await response.json();
  //     setUrl(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (originalUrl, ttl) => {
    try {
      const headers = {};

      // Check if the user is logged in
      if (currentUser && currentUser.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers, // Include other headers
        },
        body: JSON.stringify({ originalUrl, ttl }), // Include TTL in the request body
      });

      if (!response.ok) {
        throw new Error(`Failed to shorten URL. Status: ${response.status}`);
      }

      const data = await response.json();
      setUrl(data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <header>
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
  
      </header>
      <h1>URL Shortener , welcome {isLoggedIn}</h1>
      <UrlForm onSubmit={handleSubmit} />
      <UrlInfo url={url} />
      {url && <Redirect shortCode={url.shortCode} />}
    </div>
  );
};

export default App;
