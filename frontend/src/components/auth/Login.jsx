// Login.js

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Call the login function from the useAuth context
        await login(email, password);
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
