import { useState, useEffect } from 'react';
import { useTheme } from '../context/Theme';
import { CSVLink } from "react-csv";
import { useUrl } from '../context/UrlContext';
import { format } from 'date-fns';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';



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

const Dashboard = () => {
  const { theme } = useTheme();
  const { url, updateUrl, deleteUrl, deleteUrlBulk } = useUrl();
  const [updatedSelectedDate, setUpdatedSelectedDate] = useState(null);
  const [updatedOriginalUrl, setUpdatedOriginalUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [searchTerm, setSearchTerm] = useState('');

  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [viewQrModalIsOpen, setViewQrModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteBulkModalIsOpen, setDeleteBulkModalIsOpen] = useState(false);

  const [selectedUrls, setSelectedUrls] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [urlsPerPage, setUrlsPerPage] = useState(10);

  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;

  //QR Code image types
  const [selectedImageType, setSelectedImageType] = useState('png');




  // Reset when the modal is opened or closed
  useEffect(() => {
    setUpdatedOriginalUrl('');
    setUpdatedSelectedDate(null);


  }, [editModalIsOpen, url]);



  const handleOpenModal = (data) => {
    setModalData(data);
    // setModalIsOpen(true);
    setEditModalIsOpen(true);
  };
  const handleOpenQRModal = (data) => {
    setModalData(data);
    // setModalIsOpen(true);
    setViewQrModalIsOpen(true);
  };

  const handleUpdate = (urlId) => {

    if (updatedOriginalUrl || updatedSelectedDate) {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + 7);

      const formattedDate = format(new Date(updatedSelectedDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

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

  // limit the number of urls per page
  filteredUrls = filteredUrls.slice(indexOfFirstUrl, indexOfLastUrl);


  if (searchTerm) {
    filteredUrls = filteredUrls.filter((url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedFilter === 'All') {
    filteredUrls = filteredUrls.sort((a, b) => a.createdAt.localeCompare(b.expiresAt));
  } else if (selectedFilter === 'expiresAt') {
    filteredUrls = filteredUrls.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  } else if (selectedFilter === 'visits') {
    filteredUrls = filteredUrls.sort((a, b) => b.visits - a.visits);
  }


  //pagitation
  const nextPage = () => {
    if (currentPage < Math.ceil(url.length / urlsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div className='relative'>

      <div className="sm:flex sm:flex-row sm:flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div className="">

          <div className="grid grid-cols-2 md:flex items-center justify w-[100%] p-2 ">
            <div className='col-span-1'>
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
            </div>

            <div className='col-span-1'>
              <div className="m-4 ">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`p-2 border rounded ${theme ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"}`}
                >
                  <option value="All">All</option>
                  <option value="expiresAt">Expiration Date</option>
                  <option value="visits">Visits</option>
                </select>
              </div>
            </div>

            <div className="col-span-3 md:w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

              </div>
              <input type="text" id="simple-search" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5   ${theme ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"}`} placeholder="Search for link..." required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='order-first md:order-last'>

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

          </div>


          <div className="overflow-x-auto md:overflow-x-visible">
            <table className={` ${theme ? "bg-gray-800" : "bg-gray-200"} rounded-lg `}>
              <thead className="">
                <tr className=''>
                  <th scope="col" className="p-4">
                    <div className="flex ">
                      <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                        checked={selectedUrls.length === url.length && url.length !== 0}

                        onChange={() => {
                          if (selectedUrls.length === url.length) {
                            setSelectedUrls([]);
                          } else {
                            setSelectedUrls(url.map((url) => url._id));
                          }
                        }}
                      />

                    </div>
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Original Url
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Short Url
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Url Views
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Created Date
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Expiration Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    View <br/>QR Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody  >
                {filteredUrls.map((url) => (
                  <tr className={`${theme ? "bg-gray-700 hover:bg-gray-600" : "bg-white border-b hover:bg-gray-50"}`}
                    key={url._id}
                  >
                    <td className=" p-4">
                      <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                          onChange={() => handleCheckboxChange(url._id)}
                          checked={selectedUrls.includes(url._id)}
                        />
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <td className="px-2 py-2 " >
                      {url.originalUrl.split('').length > 20 ? url.originalUrl.split('').slice(0, 20).join('') + '...' : url.originalUrl}

                    </td>
                    <td className="px-2 py-2">
                      <Link to={url.shortUrl} target="_blank" rel="noreferrer" className="font-medium text-purple-400  hover:underline">
                        {url.shortUrl}
                      </Link>
                    </td>
                    <td className="px-2 py-2">
                      {url.visits}
                    </td>
                    <td className="px-2 py-2">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-2 py-2">
                      {formatDate(url.expiresAt)}
                    </td>
                    <td className="px-2 py-2">
                      <div className='flex justify-center'
                        onClick={() => handleOpenQRModal(url)}
                      >
                        <i className="fas fa-qrcode text-green-500 hover:text-green-800"></i>
                      </div>
                    </td>
                    <td className="flex justify-center items-center px-6 py-4">
                      <a href="#" className="font-medium  hover:underline m-2" onClick={() => handleOpenModal(url)}>
                        <i className="fas fa-edit"></i>
                      </a>
                      <a href="#" className="font-medium text-red-600  hover:underline m-2" onClick={() => handleDeleteModal(url)}>
                        <i className="fas fa-trash"></i>
                      </a>
                    </td>

                  </tr>

                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Modals */}

      {/* Single Edit Modal */}
      <div>
        {editModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4 md:max-w-3xl w-full mx-auto">
              <div className={`relative rounded-lg shadow grid grid-cols-1 gap-4 p-4 md:p-5 text-center ${theme ? "bg-gray-800" : "bg-white"} `}>
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
                    <label className="inline-flex items-center justify-center w-full p-4 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 ">
                      <div className="block">
                        <div className="w-full mx-4 flex justify-around items-center text-lg font-semibold">
                          <Link>{modalData.shortUrl}</Link>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 p-2 rounded "
                            onClick={copyToClipboard}
                          >Copy</span>

                        </div>

                      </div>

                    </label>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='flex justify-around'>
                    <div className='col-1'>
                      <label className="w-full text-lg font-semibold">VIEW COUNT</label>
                      <label className="  inline-flex items-center justify-center w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 ">
                        <div className="block">
                          <div className="w-full  text-lg font-semibold">{modalData.visits}
                          </div>

                        </div>

                      </label>

                    </div>

                    <div className='col-1'>

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
                  {/* <div className='flex flex-col items-center'>

                    <label className="w-full text-lg font-semibold">QR CODE</label>
                    <img src={modalData.qrCode} alt="QR Code" className="" />
                  </div> */}
                </div>


                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 mx-2"
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

      {/* Single Delete Modal */}
      <div>
        {deleteModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4">
              <div className="relative bg-white rounded-lg shadow ">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  onClick={() => setDeleteModalIsOpen(false)}
                >
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                    Are you sure you want to delete this short URL?
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                    onClick={handleDeleteConfirm}
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
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

      {/* Bulk Delete Modal */}
      <div>
        {deleteBulkModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4">
              <div className="relative bg-white rounded-lg shadow ">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                  onClick={() => setDeleteBulkModalIsOpen(false)}
                >
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                    Are you sure you want to delete all selected short URLS?
                  </h3>
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                    onClick={handleBulkDelete}
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
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

      {/* QR Modal */}
      <div>
        {viewQrModalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="relative p-4">


              <div className="relative bg-white rounded-lg shadow ">
                <button
                  type="button"
                  className="
                absolute top-1 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center
                "
                  onClick={() => setViewQrModalIsOpen(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>

                <div className="p-4 md:p-5 text-center">
                  <h3 className="m-5 text-lg font-normal text-gray-500 ">
                    To view URl, please Scan the QR Code.
                  </h3>

                  <div className='flex flex-col justify-center '>
                    <div>
                      {modalData.qrCode && (<img src={modalData.qrCode} alt="QR Code" className="w-full" />)}
                    </div>

                    <div className='flex flex-col  gap-4'>
                      <label className="text-gray-600 font-medium">Choose an Image Type:</label>
                      <ul
                        className="p-2 border border-gray-300 rounded-md flex flex-row justify-around items-center"
                        value={selectedImageType}
                        onChange={(e) => setSelectedImageType(e.target.value)}
                      >
                        {
                          ['png', 'jpeg', 'webp'].map((type) => (
                            <li
                              key={type}
                              className=''
                            >
                              <label className="flex justify-center items-center">
                                <input
                                  type="radio"
                                  className="form-radio bg-gray-200 focus:ring-blue-500 focus:border-blue-500 text-blue-600 border-gray-300 rounded"
                                  name="accountType"
                                  value={type}
                                  checked={selectedImageType === type}
                                  onChange={(e) => setSelectedImageType(e.target.value)}
                                />
                                <span className="ml-2">{type.toUpperCase()}</span>
                              </label>
                            </li>
                          ))
                        }
                      </ul>


                      <button
                        type="button"
                        className=" text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm items-center px-5 py-2.5 text-center"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `${modalData.shortUrl}.${selectedImageType}`;
                          link.href = modalData.qrCode;
                          link.click();
                        }}
                      >
                        Download {selectedImageType.toUpperCase()}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-evenly items-center m-4">
                    <p className="text-gray-500 text-sm font-medium">Share on: </p>
                    <TwitterShareButton
                      url={modalData.shortUrl}
                      title="QR Code"
                      className='mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                    >
                      <i className="fab fa-twitter"></i>
                    </TwitterShareButton>


                    <WhatsappShareButton
                      url={modalData.shortUrl}
                      title="QR Code"
                    >
                      <i className="fab fa-whatsapp text-green-500"></i>
                    </WhatsappShareButton>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            {currentPage === 1 ? (
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-gray-300 border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed "
                onClick={prevPage}
              >
                Previous
              </a>
            ) : (
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                onClick={prevPage}
              >
                Previous
              </a>
            )}
          </li>


          {
            [...Array(Math.ceil(url.length / urlsPerPage))].map((_, i) => (
              <li key={i}>
                {currentPage === i + 1 ? (
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-gray-300 border border-e-0 border-gray-300  cursor-not-allowed "
                  >
                    {i + 1}
                  </a>
                ) : (
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </a>
                )}
              </li>
            ))
          }


          <li>
            {
              currentPage === Math.ceil(url.length / urlsPerPage) ? (
                <a className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-gray-300 border border-e-0 border-gray-300 rounded-e-lg cursor-not-allowed ">
                  Next
                </a>
              ) : (
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                  onClick={nextPage}
                >Next</a>
              )
            }

          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Dashboard;
