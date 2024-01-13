// src/components/UrlInfo.js
import React from 'react';

const UrlInfo = ({ url }) => {
  if (!url) {
    return null;
  }

  return (
    <div>
      <p>Original URL: {url.originalUrl}</p>
      <p>Short Code: {url.shortCode}</p>
      <p>Short URL: {url.shortUrl}</p>
    </div>
  );
};

export default UrlInfo;
