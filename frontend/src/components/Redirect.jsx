// src/components/Redirect.js
import React, { useEffect } from 'react';

const Redirect = ({ shortCode }) => {
  useEffect(() => {
    // Redirect logic here (e.g., window.location.href)
  }, [shortCode]);

  return <p>Redirecting...</p>;
};

export default Redirect;
