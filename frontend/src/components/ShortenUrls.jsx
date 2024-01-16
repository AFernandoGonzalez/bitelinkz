import { useState, useEffect } from 'react';
import { useUrl } from '../context/UrlContext';
import { useAuth } from '../context/AuthContext';
// import DatePicker from "react-datepicker";
import { format, parseISO } from 'date-fns';
import { ShortenUrlModal } from './ShortenUrlModal'

const ShortenUrls = () => {
    const { url, updateUrl, deleteUrl } = useUrl();
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setDate(currentDate.getDate() + 7);

            const formattedDate = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            updateUrl(urlId, updatedOriginalUrl, formattedDate);
            setUpdatedOriginalUrl('');
            // closeModal();

        }
    };

    const handleDelete = (urlId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this URL?');

        if (confirmDelete) {
            deleteUrl(urlId);
            closeModal();
        }
    };


    if (!url) {
        return null;
    }
  return (
    <div>
        <h1>Shorten Urls</h1>
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

                              <ShortenUrlModal 
                              url={url}
                                handleUpdate={handleUpdate}
                                handleDelete={handleDelete}
                                openModal={openModal}
                                closeModal={closeModal}
                                modalIsOpen={modalIsOpen}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                updatedOriginalUrl={updatedOriginalUrl}
                                setUpdatedOriginalUrl={setUpdatedOriginalUrl}

                               />

                          </div>}
                      </li>
                  ))
              }
          </ul>
    </div>
  )
}

export default ShortenUrls