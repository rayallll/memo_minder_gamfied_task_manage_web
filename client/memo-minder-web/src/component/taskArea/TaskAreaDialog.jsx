// TaskAreaDialog.jsx

import React, { useState, useEffect } from 'react';
import './TaskAreaDialog.css'; 

const TaskAreaDialog = ({ item, editingType, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(item.title || '');
  const [notes, setNotes] = useState(item.note || '');
  //const [type, setType] = useState(item.type || '');
  const [positive, setPositive] = useState(item.type === 'positive' || item.type === 'both');
  const [negative, setNegative] = useState(item.type === 'negative' || item.type === 'both');
  //const [completed, setCompleted] = useState(item.completed);
  //const [price, setPrice] = useState(item.price);

  console.log('TaskArea item prop:', item);
  console.log('TaskArea editingType prop:', editingType);



  //const togglePositive = () => {
    //setPositive(!positive);
  //};

  //const toggleNegative = () => {
      //setNegative(!negative);
  //};


  useEffect(() => {
    // when item change the state will be updated
    setTitle(item.title || '');
    setNotes(item.note || '');
    //setType(item.type || '')
    setPositive(item.type === 'positive' || item.type === 'both');
    setNegative(item.type === 'negative' || item.type === 'both');
  }, [item]);


  const handleSave = () => {
    if (editingType === 'Habit') {
      const updatedItem = {
        ...item,
        habitId: item._id,
        content: title,
        notes,
        positive,
        negative,
        types: positive && negative ? 'both' : positive && negative ? 'neutral' : positive ? 'positive' : 'negative',

      };
      console.log("update by dialog", updatedItem)
      onSave(updatedItem);
    } 
    /*
    else if (editingType === 'Daily') {
      const updatedItem = {
        ...item,
        dailyId: item._id,
        content: title,
        notes,
      };
      onSave(updatedItem);
    }
    else if (editingType === 'To-Do') {
      const updatedItem = {
        ...item,
        todoId: item._id,
        content: title,
        notes,
      };
      onSave(updatedItem);
    }
    else if (editingType === 'Reward'){
      const updatedItem = {
        ...item,
        rewardId: item._id,
        content: title,
        notes,
      };
      onSave(updatedItem);
    }
    */
  };

  const handleDelete = () => {
    const deletedItem = {
      ...item,
      habitId: item._id,
    };
    onDelete(deletedItem);
    console.log('Dialog - Habit to be delete:', deletedItem);
    console.log('Dialog - HabitId to be delete:', deletedItem._id);
  };

  return (
    <div className="dialogBackdrop">
      <div className="dialog">
        <h2>{`Edit ${editingType}`}</h2>
        <label>
          Title*:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        {/*(editingType === 'Reward') && (
            <div className="dialogHeaderNotes">
              <label>
                Price*:
                <input value={price} onChange={(e) => setPrice(e.target.value)} />
              </label>
            </div>
        )*/}
        
        <div className="dialogButtons">
          <button onClick={handleDelete}>{`Delete this ${editingType}`}</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        <div className="dialogHeaderButtonsWrapper">
          {editingType === 'Habit' && (
            <div className="dialogHeaderButtons">
              <button className={`pos ${positive ? 'active' : 'inactive'}`} >
                Positive
              </button>
              <button className={`neg ${negative ? 'active' : 'inactive'}`} >
                Negative
              </button>
            </div>
          )}

          {/*((editingType === 'Daily') || (editingType === 'To-Do')) && (
            <div className="dialogHeaderButtons">
              <button className={`comp ${completed ? 'inactive' : 'active'}`} onClick={() => setCompleted(!completed)}>
                {completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              </button>
            </div>
          )*/}

        </div>
      </div>
    </div>
  );
};

export default TaskAreaDialog;
