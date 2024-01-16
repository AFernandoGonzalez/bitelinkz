import { useState } from 'react';
import { useUrl } from '../context/UrlContext';

export const UrlForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const { url, createShortUrl } = useUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createShortUrl(originalUrl);

      // Check if the URL already exists in the array
      if (!url.some((existingUrl) => existingUrl.shortUrl === data.shortUrl)) {
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
    <div>
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
    </div>
  );
};