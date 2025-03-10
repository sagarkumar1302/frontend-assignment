import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Yes
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
