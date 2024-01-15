import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUrl } from '../context/UrlContext';

const UrlForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const { currentUser, guestUserId } = useAuth();
  const { url, setUrl } = useUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {};
      // Check if the user is logged in
      if (currentUser && currentUser.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      } else {
        headers['guest-user-id'] = guestUserId;
      }

      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers, // Include other headers
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to shorten URL. Status: ${response.status}`);
      }

      const data = await response.json();
      // Check if the URL already exists in the array
      if (!url.some((existingUrl) => existingUrl.shortUrl === data.shortUrl)) {
        // Update the URL array without replacing it
        setUrl((prevUrls) => [...prevUrls, data]);
        // Clear the input field
        setOriginalUrl('');
      } else {
        console.log('URL already exists');
        setOriginalUrl('');
        throw new Error('URL already exists');
      }
    } catch (error) {
      console.error(error.message);
      setOriginalUrl('');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Original URL:
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
      </label>
      <button type="submit">Shorten URL</button>
    </form>
  );
};

export default UrlForm;
