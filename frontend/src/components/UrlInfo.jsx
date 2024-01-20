import { useState, useEffect } from 'react';

import { CSVLink } from "react-csv";
import { useUrl } from '../context/UrlContext';
import { format, parseISO } from 'date-fns';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
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
  const { url, updateUrl, deleteUrl, deleteUrlBulk } = useUrl();
  const [updatedSelectedDate, setUpdatedSelectedDate] = useState(null);
  const [updatedOriginalUrl, setUpdatedOriginalUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [searchTerm, setSearchTerm] = useState('');

  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteBulkModalIsOpen, setDeleteBulkModalIsOpen] = useState(false);

  const [selectedUrls, setSelectedUrls] = useState([]);






  // console.log("modalData", modalData);

  // console.log(new Date(url[0]?.expiresAt).toISOString().split('T')[0]);

  // Reset when the modal is opened or closed
  useEffect(() => {
    setUpdatedOriginalUrl('');
    setUpdatedSelectedDate(null);

  }, [editModalIsOpen]);

  console.log('url', url);


  const handleOpenModal = (data) => {
    setModalData(data);
    // setModalIsOpen(true);
    setEditModalIsOpen(true);
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

    toast.success('Url updated successfully', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });


    setEditModalIsOpen(false);
  };

  const handleDeleteModal = (data) => {
    setModalData(data);
    setDeleteModalIsOpen(true);
  };


  const handleDeleteConfirm = () => {
    deleteUrl(modalData._id);
    setDeleteModalIsOpen(false);
    toast.success('Url deleted successfully', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
  };

  const handleBulkDelete = () => {

    if (selectedUrls.length > 0) {
      const objectIds = selectedUrls.map((urlId) => ({ _id: urlId }));
      deleteUrlBulk(objectIds);
      setDeleteBulkModalIsOpen(false);

      setSelectedUrls([]);

      toast.success('Urls deleted successfully', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    } else {
      toast.error('Please select at least one URL', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }

  };

  const handleCancelBulkDelete = () => {
    setDeleteBulkModalIsOpen(false);
    setSelectedUrls([]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(modalData.shortUrl);
    toast.success('Copied to clipboard', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
  };

  const handleCheckboxChange = (urlId) => {
    console.log('handleCheckboxChange', urlId);
    setSelectedUrls((prevSelected) => {
      if (prevSelected.includes(urlId)) {
        return prevSelected.filter((id) => id !== urlId);
      } else {
        return [...prevSelected, urlId];
      }
    });
  };




  if (!url) {
    return null;
  }

  let filteredUrls = [...url];

  if (searchTerm) {
    filteredUrls = filteredUrls.filter((url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedFilter === 'expiresAt') {
    filteredUrls = filteredUrls.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  } else if (selectedFilter === 'visits') {
    filteredUrls = filteredUrls.sort((a, b) => b.visits - a.visits);
  }

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <div className="">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">

          <div className="flex items-center justify-between w-full ">
            <button
              type="button"
              className="font-medium m-4"
              onClick={() => setDeleteBulkModalIsOpen(true)}
              disabled={selectedUrls.length === 0}
            >
              {selectedUrls.length > 1 ? (
                <>
                  <span className="m-2"></span>
                  <i className="fas fa-trash text-red-600"></i>
                </>
              ) : (
                <>
                  <span className="m-2"></span>
                  <i className="fas fa-trash text-gray-400"></i>
                </>
              )}

            </button>

            <div>

              <div className="m-4">

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

            </div>
            {/* <div>
            <input
              type="text"
              placeholder="Search by URL"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded"
            />
          </div> */}

            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for link..." required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {
              url.length > 0 ? (
                <CSVLink
                  data={filteredUrls}
                  headers={[
                    { label: "Original Url", key: "originalUrl" },
                    { label: "Short Url", key: "shortUrl" },
                    { label: "Url Views", key: "visits" },
                    { label: "Expiration Date", key: "expiresAt", formatter: (col) => formatDate(col.expiresAt) },
                    // Add more headers for additional fields
                  ]}
                  filename="url_info_export.csv"
                >
                  {/* <button className="bg-green-500 text-white rounded p-2">Export to CSV</button> */}
                  <button type="submit" className="m-2 p-1 ms-2 text-sm font-medium text-white bg-green-700 rounded-lg border  hover:bg-green-800 ">

                    Export to CSV
                  </button>
                </CSVLink>
              ) : (
                <CSVLink
                  data={filteredUrls}
                  headers={[
                    { label: "Original Url", key: "originalUrl" },
                    { label: "Short Url", key: "shortUrl" },
                    { label: "Url Views", key: "visits" },
                    { label: "Expiration Date", key: "expiresAt", formatter: (col) => formatDate(col.expiresAt) },
                    // Add more headers for additional fields
                  ]}
                  filename="url_info_export.csv"
                >
                  {/* <button className="bg-green-500 text-white rounded p-2">Export to CSV</button> */}
                  <button type="submit" className="m-2 p-1 ms-2 text-sm font-medium text-white  rounded-lg border  bg-gray-300 cursor-not-allowed "
                    disabled
                  >

                    Export to CSV
                  </button>
                </CSVLink>
              )
            }

          </div>

          {/* dropdown */}

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedUrls.length === url.length && url.length !== 0}

                      onChange={() => {
                        if (selectedUrls.length === url.length) {
                          setSelectedUrls([]);
                        } else {
                          setSelectedUrls(url.map((url) => url._id));
                        }
                      }}
                    />
                    <label className="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Original Url
                </th>
                <th scope="col" className="px-6 py-3">
                  Short Url
                </th>
                <th scope="col" className="px-6 py-3">
                  Url Views
                </th>
                <th scope="col" className="px-6 py-3">
                  Expiration Date
                </th>
                <th scope="col" className="px-6 py-3">
                  QR Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {filteredUrls.map((url) => (
              <tbody key={url._id} >
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={() => handleCheckboxChange(url._id)}
                        checked={selectedUrls.includes(url._id)}
                      />
                      <label className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style={{
                    overflowX: "scroll", maxWidth: "200px"
                  }}>
                    {url.originalUrl}

                  </th>
                  <td className="px-6 py-4">
                    {url.shortUrl}
                  </td>
                  <td className="px-6 py-4">
                    {url.visits}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(url.expiresAt)}
                  </td>
                  <td className="px-6 py-4">
                    <img src={url.qrCode} alt="QR Code" className="w-6 h-6" />
                  </td>
                  <td className="flex justify-center items-center px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline m-2" onClick={() => handleOpenModal(url)}>
                      <i className="fas fa-edit"></i>
                    </a>
                    <a href="#" className="font-medium text-red-600 dark:text-blue-500 hover:underline m-2" onClick={() => handleDeleteModal(url)}>
                      <i className="fas fa-trash"></i>
                    </a>
                  </td>

                </tr>

              </tbody>
            ))}
          </table>

        </div>
      </div>
      <div>
        {editModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4 md:max-w-3xl w-full mx-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 grid grid-cols-1 gap-4 p-4 md:p-5 text-center">
                <div>
                  <div className='py-4'>
                    <label className=" w-full text-lg font-semibold">ORIGINAL URL</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg w-full p-4"
                      placeholder="Type product name"
                      required=""
                      value={updatedOriginalUrl || modalData.originalUrl}
                      onChange={(e) => setUpdatedOriginalUrl(e.target.value)}
                    />
                  </div>
                  <div className='py-4'>
                    <label className="w-full text-lg font-semibold">SHORT URL</label>
                    <label className="inline-flex items-center justify-center w-full p-4 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                      <div className="block">
                        <div className="w-full mx-4 flex justify-around items-center text-lg font-semibold">
                          <p>{modalData.shortUrl}</p>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 p-2 rounded dark:bg-green-900 dark:text-green-300"
                            onClick={copyToClipboard}
                          >Copy</span>

                        </div>

                      </div>

                    </label>
                  </div>
                </div>
                <div className='md:grid md:grid-cols-2'>
                  <div className='flex flex-col justify-around'>
                    <div>
                      <label className="w-full text-lg font-semibold">VIEW COUNT</label>
                      <label className="  inline-flex items-center justify-center w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg  dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 ">
                        <div className="block">
                          <div className="w-full  text-lg font-semibold">{modalData.visits}
                          </div>

                        </div>

                      </label>

                    </div>
                    <div>

                      <label className="w-full text-lg font-semibold">EXPIRATION DATE</label>
                      <input
                        type="date"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                        placeholder="Type product name"
                        required=""
                        value={updatedSelectedDate || (modalData.expiresAt ? new Date(modalData.expiresAt).toISOString().split('T')[0] : '')}
                        onChange={(e) => setUpdatedSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col items-center'>

                    <label className="w-full text-lg font-semibold">QR CODE</label>
                    <img src={modalData.qrCode} alt="QR Code" className="" />
                  </div>
                </div>


                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 mx-2"
                    onClick={() => setEditModalIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 focus:outline-none f rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 mx-2 "
                    onClick={() => handleUpdate(modalData._id)}
                  >
                    Update
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>

      <div>
        {deleteModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setDeleteModalIsOpen(false)}
                >
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this short URL?
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                    onClick={handleDeleteConfirm}
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={() => setDeleteModalIsOpen(false)}
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {deleteBulkModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setDeleteBulkModalIsOpen(false)}
                >
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete all selected short URLS?
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                    onClick={handleBulkDelete}
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={handleCancelBulkDelete}
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default UrlInfo;
