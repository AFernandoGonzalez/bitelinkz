// Register.js

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        // Call the register function from the useAuth context
        await register(email, password);
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
