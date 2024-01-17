import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ManageLinks } from './pages/ManageLinks';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Register from './components/auth/register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useTheme } from './context/Theme';
import './App.css';

const App = () => {

  const { theme } = useTheme();

  return (
    <div className={`app 
    ${theme ? "dark-mode bg-gray-900 text-white" : "light-mode bg-white"} `} >
      <header>
        <Navbar />
      </header>
      <main className='
      max-w-screen-md mx-auto mt-8 text-center
      '>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/manage-links"
            element={
              <ProtectedRoute>
                <ManageLinks />
              </ProtectedRoute>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer theme={theme}/>
    </div>
  );
};

export default App;
