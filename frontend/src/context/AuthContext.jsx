import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { API_BASE_URL } from '../constants';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken || null;
    });

    useEffect(() => {
        if (token) {
            // If a token is available, set it in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Set current user including the token
            const userWithToken = { ...response.data.user, token: response.data.token };
            setCurrentUser(userWithToken);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(userWithToken));
        } catch (err) {
            console.error(err);
        }
    };

    const register = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/register`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Set current user including the token
            const userWithToken = { ...response.data.user, token: response.data.token };
            setCurrentUser(userWithToken);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(userWithToken));
        } catch (err) {
            console.error(err);
        }
    };

    // Log out the user
    // Log out the user
    const logout = () => {
        setCurrentUser(null); // Remove user from state
        localStorage.removeItem('token'); // Clear token from local storage
        localStorage.removeItem('user'); // Clear user from local storage
    };


    const value = {
        currentUser,
        login,
        register,
        logout
    };

    // console.log('AuthContext -> value', value);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
