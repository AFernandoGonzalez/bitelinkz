import { useState, useEffect, useMemo } from 'react';
import { useUrl } from '../context/UrlContext';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import './UrlInfo.css'
import { UrlItem } from './UrlItem';


Modal.setAppElement('#root');

const UrlInfo = () => {
  const { url, updateUrl, deleteUrl } = useUrl();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updatedOriginalUrl, setUpdatedOriginalUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

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

  // const filteredUrls = useMemo(() => {
  //   console.log('Filtering URLs...'); 
  //   const newUrl = [...url];
  //   if (selectedFilter === 'All') {
  //     return newUrl;
  //   }
  //   else if (selectedFilter === 'expiresAt') {
  //     return newUrl.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  //   } 
  //   else if (selectedFilter === 'visits') {
  //     return newUrl.sort((a, b) => b.visits - a.visits);
  //   }
  //   return newUrl;
  // }, [url, selectedFilter]);
  
  

  let filteredUrls = [...url];

  if (selectedFilter === 'expiresAt') {
    filteredUrls = filteredUrls.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  } else if (selectedFilter === 'visits') {
    filteredUrls = filteredUrls.sort((a, b) => b.visits - a.visits);
  }

  return (
    <div>
      <div>
        <label htmlFor="originalUrl">Filter</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="expiresAt">Expiration Date</option>
          <option value="visits">Visits</option>
        </select>
      </div>
      <ul>
        {filteredUrls.map((url) => (
          <UrlItem
            key={url._id}
            url={url}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            currentUser={currentUser}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            updatedOriginalUrl={updatedOriginalUrl}
            setUpdatedOriginalUrl={setUpdatedOriginalUrl}
            openModal={openModal}
            closeModal={closeModal}
            modalIsOpen={modalIsOpen}
          />
        ))}
      </ul>
    </div>
  );
};

export default UrlInfo;
