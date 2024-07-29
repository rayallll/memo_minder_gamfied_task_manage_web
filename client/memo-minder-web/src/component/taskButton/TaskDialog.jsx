import React from 'react';
import './TaskButton.css';

// TODO: dialog.css
const TaskDialog = ({ title, onCancel, onClick, children }) => {
    return (
        <div className="habit-dialog">
            <div className="dialog-header">
                <h2>{title}</h2>
                <div className="dialog-buttons">
                    <button onClick={onCancel} className="cancel-button">Cancel</button>
                    <button onClick={onClick} className="create-button">Create</button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default TaskDialog;
