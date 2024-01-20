import { useState } from 'react';
import { useUrl } from '../context/UrlContext';
import { toast } from 'react-toastify';

export const UrlForm = ({ theme }) => {
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
        toast.success('Short URL created successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
      } else {
        setOriginalUrl('');
        toast.error('URL already exists', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
      }
    } catch (error) {
      setOriginalUrl('');
      toast.error(error.message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
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
          placeholder="https://example.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className={inputClass}
        />
        <button type="submit" className={buttonClass}>
          Short Link
        </button>
      </form>
    </div>
  );
};
