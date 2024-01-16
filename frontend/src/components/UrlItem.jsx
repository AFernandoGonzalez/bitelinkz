import { ShortenUrlModal } from './ShortenUrlModal';

export const UrlItem = ({
    url,
    handleUpdate,
    handleDelete,
    currentUser,
    openModal,
    closeModal,
    modalIsOpen,
    selectedDate,
    setSelectedDate,
    updatedOriginalUrl,
    setUpdatedOriginalUrl,

}) => {
    return (
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
            {currentUser && (
                <div>
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
                </div>
            )}
        </li>
    );
};