import { useState, useEffect } from 'react';
import { useUrl } from '../context/UrlContext';
import { format, parseISO } from 'date-fns';
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import './UrlInfo.css';

Modal.setAppElement('#root');

const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

};

const UrlInfo = () => {
  const { url, updateUrl, deleteUrl } = useUrl();
  const [updatedSelectedDate, setUpdatedSelectedDate] = useState(null);
  const [updatedOriginalUrl, setUpdatedOriginalUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  // console.log("modalData", modalData);

  // console.log(new Date(url[0]?.expiresAt).toISOString().split('T')[0]);

  // Reset when the modal is opened or closed
  useEffect(() => {
    setUpdatedOriginalUrl('');
    setUpdatedSelectedDate(null);
  }, [modalIsOpen]);

  const handleOpenModal = (data) => {
    setModalData(data);
    setModalIsOpen(true);
  };

  const handleUpdate = (urlId) => {

    console.log('handleUpdate', urlId);

    if (updatedOriginalUrl || updatedSelectedDate) {
      const currentDate = new Date();
      console.log('currentDate', currentDate);
      const expirationDate = new Date(currentDate);
      console.log('expirationDate', expirationDate);
      expirationDate.setDate(currentDate.getDate() + 7);

      const formattedDate = format(new Date(updatedSelectedDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      console.log('formattedDate', formattedDate);

      const urlToUpdate = updatedOriginalUrl !== '' ? updatedOriginalUrl : modalData.originalUrl;


      updateUrl(urlId, urlToUpdate, formattedDate);

    }

    setModalIsOpen(false);
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

  let filteredUrls = [...url];

  if (selectedFilter === 'expiresAt') {
    filteredUrls = filteredUrls.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  } else if (selectedFilter === 'visits') {
    filteredUrls = filteredUrls.sort((a, b) => b.visits - a.visits);
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <label htmlFor="originalUrl" className="mr-2">Filter:</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="expiresAt">Expiration Date</option>
          <option value="visits">Visits</option>
        </select>
      </div>
      <div className="">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">Original URL</th>
              <th className="py-3 px-6 text-left">Short URL</th>
              <th className="py-3 px-6 text-left">URL Views</th>
              <th className="py-3 px-6 text-left">Expiration Date</th>
              <th className="py-3 px-6 text-left">QR Code</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrls.map((url) => (
              <tr key={url._id}>
                <td className="py-4 ">{url.originalUrl}</td>
                <td className="py-4 ">{url.shortUrl}</td>
                <td className="py-4 ">{url.views}</td>
                <td className="py-4 ">{formatDate(url.expiresAt)}</td>
                <td className="py-4 px-6">
                  <img src={url.qrCode} alt="QR Code" className="w-6 h-6" />
                </td>
                <td className="py-2 px-2">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => handleOpenModal(url)}>Update</button>
                </td>
                <td className="py-2 px-2">
                  <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => handleDelete(url._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          {/* Use the modalData to populate the modal content */}
          <p>{modalData.originalUrl}</p>
          <p>{modalData.shortUrl}</p>
          <p>{modalData.expiresAt}</p>
          {/* Add more modal content as needed */}

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Original Url</label>
              <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Type product name" required=""
                value={updatedOriginalUrl || modalData.originalUrl}
                onChange={(e) => setUpdatedOriginalUrl(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Short Url</label>
              {modalData.shortUrl}

            </div>
            <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Url Views</label>
              {modalData.views}
            </div>

            <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expiration Date</label>
              <input type="date" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Type product name" required=""
                value={updatedSelectedDate || (modalData.expiresAt ? new Date(modalData.expiresAt).toISOString().split('T')[0] : '')}


                onChange={(e) => setUpdatedSelectedDate(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">QR CODE</label>
              <img src={modalData.qrCode} alt="QR Code" className="" />
            </div>


          </div>
          <button type="submit" className="m-2 p-2 rounded text-white inline-flex items-center bg-blue-700 " onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="m-2 p-2 rounded text-white inline-flex items-center bg-blue-700 " onClick={() => handleUpdate(modalData._id)}>
            Update
          </button>
        </Modal>
      )}
    </div>
  );
};

export default UrlInfo;
