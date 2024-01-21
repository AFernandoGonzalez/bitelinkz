// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { toast } from 'react-toastify';

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

    const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const [guestUserId, setGuestUserId] = useState(() => {
        const storedGuestUserId = localStorage.getItem('guestUserId');
        return storedGuestUserId || generateUniqueId();
    });


    

    useEffect(() => {
        // Store the guest user ID in localStorage
        localStorage.setItem('guestUserId', guestUserId);
    }, [guestUserId]);


    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const setAuthData = (response) => {
        const userWithToken = { ...response.data.user, token: response.data.token };
        setCurrentUser(userWithToken);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userWithToken));
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } });
            setAuthData(response);
            toast.success('Login Successful', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            
        } catch (err) {
            toast.error(
                err.response.data.message, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            }
            )
        }
    };

    const register = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/register`, { email, password }, { headers: { 'Content-Type': 'application/json' } });
            setAuthData(response);
            toast.success('Login Successful', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        } catch (err) {
            toast.error(
                err.response.data.message, {
                position: 'top-center',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            }
            )
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logout Successful', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        guestUserId,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
