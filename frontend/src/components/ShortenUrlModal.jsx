import DatePicker from "react-datepicker";
import Modal from 'react-modal';

export const ShortenUrlModal = (
    {
        url,
        handleUpdate,
        handleDelete,
        openModal,
        closeModal,
        modalIsOpen,
        selectedDate,
        setSelectedDate,
        updatedOriginalUrl,
        setUpdatedOriginalUrl,
    }
) => {
    return (
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
    )
}
