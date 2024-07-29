import React, { useState } from 'react';
import './TaskButton.css';
import TaskDialog from './TaskDialog';

const TaskButton = ({ onAddHabit, onAddDaily, onAddTodo, onAddReward }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [habitTitle, setHabitTitle] = useState('');
    const defaultTitle = 'Add a title';
    const [habitNotes, setHabitNotes] = useState('');
    const defaultNotes = 'Add notes';
    const [rewardPrice, setRewardPrice] = useState();
    const defaultPrice = 10;
    const [positive, setPositive] = useState(true);
    const [negative, setNegative] = useState(true);

    const handleButtonClick = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuItemClick = (menuItem) => {
        console.log(`Clicked on ${menuItem}`);
        setShowMenu(false);
        setShowDialog(true);
        setDialogTitle(`Create ${menuItem}`);
    };

    // TODO: createXX logic
    const handleCreateTask = () => {
        console.log('Creating...');
        let createFunction;
        let newItem;

        switch (dialogTitle) {
            case 'Create Habit':
                createFunction = onAddHabit;
                newItem = {
                    id: Date.now(),
                    content: habitTitle || defaultTitle,
                    notes: habitNotes || defaultNotes,
                    positive: positive,
                    negative: negative
                };
                break;
            case 'Create Daily':
                createFunction = onAddDaily;
                newItem = {
                    id: Date.now(),
                    content: habitTitle || defaultTitle,
                    notes: habitNotes || defaultNotes,
                    completed: false
                };
                break;
            case 'Create To Do':
                createFunction = onAddTodo;
                newItem = {
                    id: Date.now(),
                    content: habitTitle || defaultTitle,
                    notes: habitNotes || defaultNotes,
                    completed: false
                };
                break;
            case 'Create Reward':
                createFunction = onAddReward;
                newItem = {
                    id: Date.now(),
                    content: habitTitle || defaultTitle,
                    notes: habitNotes || defaultNotes,
                    price: rewardPrice || defaultPrice
                };
                break;
            default:
                console.warn('Unknown task type:', dialogTitle);
                return;
        }

        createFunction(newItem);
        setShowDialog(false);
    };

    const handleCancel = () => {
        console.log('Canceling...');
        setShowDialog(false);
    }

    const handlePositive = () => {
        setPositive(!positive);
    };

    const handleNegative = () => {
        setNegative(!negative);
    };

    return (
        <div className="task-button-container">
            <div className="add-task-button-container" >
                <button className="add-task-button" onClick={handleButtonClick}>
                    Add Task
                </button>
            </div>

            {showMenu && (
                <div className="menu-container">
                    <button className="menu-item" onClick={() => handleMenuItemClick('Habit')}>
                        <img src="/habit.png" alt="Habit" className="menu-icon" />
                        Habit
                    </button>
                    <button className="menu-item" onClick={() => handleMenuItemClick('Daily')}>
                        <img src="/daily.png" alt="Daily" className="menu-icon" />
                        Daily
                    </button>
                    <button className="menu-item" onClick={() => handleMenuItemClick('To Do')}>
                        <img src="/todo.png" alt="To Do" className="menu-icon" />
                        To Do
                    </button>
                    <button className="menu-item" onClick={() => handleMenuItemClick('Reward')}>
                        <img src="/reward.png" alt="Reward" className="menu-icon" />
                        Reward
                    </button>

                </div>
            )}

            {showDialog && (
                <div>
                    <div className="overlay"></div>
                    <TaskDialog title={dialogTitle} onCancel={handleCancel} onClick={handleCreateTask}>
                        <div className="input-container">
                            <label>Title*:</label>
                            <br />
                            <input type="text" className="habit-input" value={habitTitle} placeholder={defaultTitle} onChange={(e) => setHabitTitle(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <label>Notes:</label>
                            <br />
                            <textarea className="habit-input" value={habitNotes} placeholder={defaultNotes} onChange={(e) => setHabitNotes(e.target.value)} />
                        </div>
                        {dialogTitle === 'Create Reward' && (
                            <div className="input-container">
                                <label>Price:</label>
                                <br />
                                <input type="number" className="habit-input" value={rewardPrice} placeholder={defaultPrice} onChange={(e) => setRewardPrice(e.target.value)} />
                            </div>)}

                        {dialogTitle === 'Create Habit' && (
                            <div>
                                <div className="dialog-buttons-circle">
                                    <button className={`round-button ${positive ? 'selected' : 'unselected'}`} onClick={handlePositive}>+</button>
                                    <button className={`round-button ${negative ? 'selected' : 'unselected'}`} onClick={handleNegative}>-</button>
                                </div>
                                <div className="dialog-description">
                                    <span>Positive</span>
                                    <span>Negative</span>
                                </div>
                            </div>
                        )}
                    </TaskDialog>
                </div>
            )}
        </div>
    );
};

export default TaskButton;
