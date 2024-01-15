import  { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { useAuth } from './AuthContext';

const UrlContext = createContext();

export const useUrl = () => {
    const context = useContext(UrlContext);
    if (!context) {
        throw new Error('useUrlContext must be used within a UrlProvider');
    }
    return context;
};

export const UrlProvider = ({ children }) => {
    const [url, setUrl] = useState([]);
    const { currentUser, guestUserId } = useAuth();

    useEffect(() => {
        const fetchUserUrls = async () => {
            try {
                const headers = {};

                // Check if the user is logged in
                if (currentUser && currentUser.token) {
                    headers['Authorization'] = `Bearer ${currentUser.token}`;
                } else {
                    headers['guest-user-id'] = guestUserId;
                    console.log('frontend : guestUserId', guestUserId);
                }

                const response = await fetch('http://localhost:8000/info/userUrls', {
                    method: 'GET',
                    headers,
                });

                if (response.ok) {
                    const data = await response.json();
                    setUrl(data);
                } else {
                    throw new Error(`Failed to fetch user's URLs. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserUrls();
    }, [currentUser, guestUserId]);

    const updateUrl = async (urlId, newOriginalUrl) => {
        try {
            const headers = {};

            // Check if the user is logged in
            if (currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            }
            //  else {
            //     headers['guest-user-id'] = guestUserId;
            // }

            const response = await fetch(`http://localhost:8000/update/${urlId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify({ originalUrl: newOriginalUrl }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update URL. Status: ${response.status}`);
            }

            const updatedUrl = await response.json();

            // Update the state with the new URL
            setUrl((prevUrls) =>
                prevUrls.map((url) => (url._id === urlId ? updatedUrl : url))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUrl = async (urlId) => {
        try {
            const headers = {};
            if(currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            }

            const response = await fetch(`http://localhost:8000/delete/${urlId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete URL. Status: ${response.status}`);
            }

            // Remove the deleted URL from the state
            setUrl((prevUrls) => prevUrls.filter((url) => url._id !== urlId));
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        url,
        setUrl,
        updateUrl,
        deleteUrl,
    };

    return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
};
