import React from 'react';

const Modal = ( open, onClose, children ) => {
  if (!open) return null;

  return (
    <div className="custom-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
