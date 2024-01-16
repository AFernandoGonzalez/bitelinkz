import React from 'react'
import { useUrl } from '../context/UrlContext';
import { Link } from 'react-router-dom';

export const LatestUrl = () => {
    const { url } = useUrl();
    const latestUrl = url[url.length - 1];

  return (
    <div>
          {latestUrl && (
              <div>
                  <h2>Latest URL </h2>
                  <p>
                      <Link to="/manage-links">Manage Links</Link>
                  </p>
                  <p>
                      <strong>Original URL:</strong> {latestUrl.originalUrl}
                  </p>
                  <p>
                      <strong>Short URL:</strong>
                      <a href={latestUrl.shortUrl}> {latestUrl.shortUrl}</a>
                  </p>
              </div>
          )}
    </div>
  )
}
