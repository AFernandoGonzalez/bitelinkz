// src/App.js
import React, { useState } from 'react';
import UrlForm from './components/UrlForm';
import UrlInfo from './components/UrlInfo';
import Redirect from './components/Redirect';

const App = () => {
  const [url, setUrl] = useState(null);

  const handleSubmit = async (originalUrl) => {
    try {
      // Make a POST request to your backend endpoint
      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      // Update 'url' state with the response JSON
      const data = await response.json();
      setUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <UrlForm onSubmit={handleSubmit} />
      <UrlInfo url={url} />
      {url && <Redirect shortCode={url.shortCode} />}
    </div>
  );
};

export default App;
