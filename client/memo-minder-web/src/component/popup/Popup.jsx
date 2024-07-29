import React, { useEffect } from 'react';
import "./Popup.css";

const Popup = ({ show, onClose, message }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1700);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="popup" style={{ backgroundColor: message.background_color }}>
      <div className="popup-content">
        <h2>{message.title}</h2>
        <p>{message.body}</p>
      </div>
    </div>
  );
};

export default Popup;
