// Logout.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";


const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="logout-page">
            <button onClick={() => {
                logout();
                navigate('/');
            }}>Logout</button>
        </div>
    );
};

export default Logout;
