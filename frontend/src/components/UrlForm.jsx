// src/components/UrlForm.js
import React, { useState } from 'react';

const UrlForm = ({ onSubmit }) => {
  const [originalUrl, setOriginalUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(originalUrl);
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
