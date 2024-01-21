import { useState } from 'react';
import { useUrl } from '../context/UrlContext';
import { toast } from 'react-toastify';

export const UrlForm = ({ theme }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const { url, createShortUrl } = useUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUrl = originalUrl.trim();

    await createShortUrl(trimmedUrl);
    setOriginalUrl('');

  };

  // Conditionally apply dark or light theme styles
  const formContainerClass = `m-8 p-6 rounded-lg shadow-md ${theme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`;

  const inputClass = `border p-2 m-2 rounded-md focus:outline-none focus:ring w-full ${theme ? 'border-gray-700 text-gray-900' : 'border-gray-300'
    }`;

  const buttonClass = `bg-blue-500 m-2 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500 ${theme ? 'hover:bg-blue-700' : 'hover:bg-blue-600'
    }`;

  return (
    <div className={formContainerClass}>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch">
        <input
          type="text"
          placeholder="https://google.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className={inputClass}
          required
        />
        <button type="submit" className={buttonClass}>
          Short Link
        </button>
      </form>
    </div>
  );
};
