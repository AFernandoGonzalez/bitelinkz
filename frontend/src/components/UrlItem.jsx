import { ShortenUrlModal } from './ShortenUrlModal';
import { useState } from 'react';

export const UrlItem = ({
    url,
    handleDelete,
    handleUpdate,
    updatedOriginalUrl,
    setUpdatedOriginalUrl,
    updatedExpirationDate,
    setUpdatedExpirationDate,

    selectedDate
}) => {

    const [isEditing, setIsEditing] = useState(false);
    
    const handleUpdateClick = () => {
        setIsEditing(true);
    };

    const handleUpdateSubmit = () => {
        // Call the handleUpdate function with the updated original URL and expiration date
        handleUpdate(url._id, updatedOriginalUrl, updatedExpirationDate);
        setIsEditing(false);
    };

    const handleCancelUpdate = () => {
        // Cancel the update and reset the state
        setIsEditing(false);
        setUpdatedOriginalUrl(url.originalUrl);
        setUpdatedExpirationDate(url.expiresAt ? new Date(url.expiresAt).toISOString().split('T')[0] : '');
    };

    return (
        <div className="flex flex-col bg-white p-4 mb-4 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Original URL
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Short URL
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Visits
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Expiration Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                QR Code
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        <tr>
                            <td className="p-4">
                                <div className="flex items-center">
                                    <input id={`checkbox-${url._id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor={`checkbox-${url._id}`} className="sr-only">checkbox</label>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex items-center text-sm">
                                    <div>
                                        {isEditing ? (
                                            // Input field for original URL during editing
                                            <input
                                                type="text"
                                                className="border border-gray-300 rounded px-2 py-1"
                                                value={updatedOriginalUrl}
                                                onChange={(e) => setUpdatedOriginalUrl(e.target.value)}
                                            />
                                        ) : (
                                            // Display current original URL
                                            <p className="font-semibold">{url.originalUrl}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-sm">
                                <p className="font-semibold">{url.shortUrl}</p>
                            </td>
                            <td className="px-6 py-3 text-sm">
                                <p className="font-semibold">{url.visits}</p>
                            </td>
                            <td className="px-6 py-3 text-sm">
                                {isEditing ? (
                                    // Input field for expiration date during editing
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded px-2 py-1"
                                        value={updatedExpirationDate}
                                        onChange={(e) => setUpdatedExpirationDate(e.target.value)}
                                    />
                                ) : (
                                    // Display current expiration date
                                        <p className="font-semibold">{selectedDate ? new Date(url.expiresAt).toLocaleDateString() : 'No expiration date'}</p>
                                )}
                            </td>
                            <td className="px-6 py-3 text-sm">
                                <img src={url.qrCode} alt="QR Code" className="w-6 h-6" />
                            </td>
                            <td className="px-6 py-3 text-sm">
                                {isEditing ? (
                                    // Update and Cancel buttons during editing
                                    <>
                                        <button className="bg font-semibold mx-2" onClick={handleUpdateSubmit}>Confirm Update</button>
                                        <button className="font-semibold mx-2" onClick={handleCancelUpdate}>Cancel</button>
                                    </>
                                ) : (
                                    // Update and Delete buttons
                                    <>
                                        <button className="font-semibold mx-2" onClick={handleUpdateClick}>Update</button>
                                        <button className="font-semibold mx-2" onClick={() => handleDelete(url._id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>

    );
};
