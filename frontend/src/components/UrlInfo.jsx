import {useState} from 'react';
import { useUrl } from '../context/UrlContext';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-qr-code';

const UrlInfo = () => {
  const { url, updateUrl, deleteUrl } = useUrl();
  const [newOriginalUrl, setNewOriginalUrl] = useState('');
  const { currentUser } = useAuth();

  const handleUpdate = (urlId) => {
    // You can implement a modal or input field for the user to enter the new original URL
    // For simplicity, I'm using a prompt here.
    const updatedOriginalUrl = prompt('Enter the new original URL:');

    if (updatedOriginalUrl) {
      updateUrl(urlId, updatedOriginalUrl);
    }
  };

  const handleDelete = (urlId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this URL?');

    if (confirmDelete) {
      deleteUrl(urlId);
    }
  };


  if (!url) {
    return null;
  }

  return (
    <div>
      <ul>
        {
          url.map((url) => (
            <li key={url._id}>
              <p>
                <strong>Short URL:</strong> <a href={url.shortUrl}>{url.shortUrl}</a>
              </p>
              <p>
                <strong>Original URL:</strong> {url.originalUrl}
              </p>
              <p>
                <strong>Visits:</strong> {url.visits}
              </p>
              <p>
                <img src={url.qrCode} alt="QR Code" />
              </p>
              {currentUser && <div>
                <button onClick={() => handleUpdate(url._id)} >Update</button>
                <button onClick={() => handleDelete(url._id)}>Delete</button>
              </div>}
              
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default UrlInfo;
