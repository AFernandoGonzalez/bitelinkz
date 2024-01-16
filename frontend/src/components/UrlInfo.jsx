import { useState, useEffect } from 'react';
import { useUrl } from '../context/UrlContext';
import { useAuth } from '../context/AuthContext';
import DatePicker from "react-datepicker";
import { format, parseISO } from 'date-fns'; // Import format and parseISO
import Modal from 'react-modal'; // Import the Modal component

import "react-datepicker/dist/react-datepicker.css";

import './UrlInfo.css'

Modal.setAppElement('#root'); // Set the root element for the modal


const UrlInfo = () => {
  const { url, updateUrl, deleteUrl } = useUrl();
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  const [updatedOriginalUrl, setUpdatedOriginalUrl] = useState('');

  const { currentUser } = useAuth();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false)

  useEffect(() => {
    if (url && url.length > 0 && url[0].expiresAt) {
      const parsedDate = parseISO(url[0].expiresAt);
      setSelectedDate(parsedDate);

      setUpdatedOriginalUrl(url[0].originalUrl || '');
    }
  }, [url]);

  const handleUpdate = (urlId) => {
    if (updatedOriginalUrl || selectedDate) {
      if (updatedOriginalUrl === url[0].originalUrl) {
        // Display an alert to the user
        alert("You are trying to update with the same URL.");
        return; // Stop the update process
      }

      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + 7);

      // Format the expiration date
      const formattedDate = format(expirationDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

      updateUrl(urlId, updatedOriginalUrl, formattedDate);
      setUpdatedOriginalUrl('');
      // closeModal();

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
                <strong>Short URL:</strong> <a href={url.shortUrl}  >{url.shortUrl}</a>
              </p>
              <p>
                <strong>Original URL:</strong> {url.originalUrl}
              </p>
              <p>
                <strong>Visits:</strong> {url.visits}
              </p>



              {currentUser && <div>
                <img src={url.qrCode} alt="QR Code" />

                <span>{url.expiresAt ? new Date(url.expiresAt).toLocaleString() : 'No expiration date'}</span>

                <div>
                  <button onClick={openModal}>Update modal</button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Update URL Modal"
                  >
                    <h2>Update URL</h2>
                    <label>
                      Original URL:
                      <input
                        type="text"
                        placeholder={url.originalUrl}
                        value={updatedOriginalUrl || url.originalUrl}
                        onChange={(e) => setUpdatedOriginalUrl(e.target.value)}
                      />
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      minDate={new Date()}
                    />
                    <button onClick={() => handleUpdate(url._id)}>Update</button>
                    <button onClick={() => handleDelete(url._id)}>Delete</button>
                    <button onClick={closeModal}>Cancel</button>
                  </Modal>
                </div>
              </div>}

            
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default UrlInfo;
