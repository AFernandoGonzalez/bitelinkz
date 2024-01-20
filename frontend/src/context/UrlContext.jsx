import  { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';


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

    const fetchUserUrls = async () => {
        try {
            const headers = {};

            // Check if the user is logged in
            if (currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            } else {
                headers['guest-user-id'] = guestUserId;
            }

            const response = await fetch(`${API_BASE_URL}/info/userUrls`, {
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
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        fetchUserUrls();
    }, [currentUser, guestUserId, setUrl]);

    const createShortUrl = async (originalUrl) => {
        try {
            const headers = {};

            // Check if the user is logged in
            if (currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            } else {
                headers['guest-user-id'] = guestUserId;
            }

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);

            const response = await fetch(`${API_BASE_URL}/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify({ originalUrl, expiresAt: expirationDate.toISOString() }),
            });

            if (!response.ok) {
                throw new Error(`Failed to shorten URL. Status: ${response.status}`);
            }

            const data = await response.json();

            // Update the URL array without replacing it
            setUrl((prevUrls) => [...prevUrls, data]);
            // toast.success('Short URL created successfully', {
            //     position: 'top-center',
            //     autoClose: 2000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     draggable: true,
            // });

            // await fetchUserUrls();

            return data; 
        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const updateUrl = async (urlId, newOriginalUrl, formattedDate) => {
        try {
            const headers = {};

            // Check if the user is logged in
            if (currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            }

            const response = await fetch(`${API_BASE_URL}/update/${urlId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify({ originalUrl: newOriginalUrl, expiresAt : formattedDate }),
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
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });

        }
    };

    const deleteUrl = async (urlId) => {
        try {
            const headers = {};
            if(currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            }

            const response = await fetch(`${API_BASE_URL}/delete/${urlId}`, {
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
            toast.success('URL deleted successfully', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });

        }
    };

    const deleteUrlBulk = async (urlIds) => {
        try {
            const headers = {};
            if (currentUser && currentUser.token) {
                headers['Authorization'] = `Bearer ${currentUser.token}`;
            }

            const response = await fetch(`${API_BASE_URL}/delete/bulkDelete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify({ urlIds }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete URLs. Status: ${response.status}`);
            }
            

            // Remove the deleted URLs from the state
            setUrl((prevUrls) => prevUrls.filter((url) => !urlIds.includes(url._id)));
            
            toast.success('URLs deleted successfully', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });

            await fetchUserUrls();


        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const value = {
        url,
        setUrl,
        createShortUrl,
        updateUrl,
        deleteUrl,
        deleteUrlBulk, 
    };

    return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
};
