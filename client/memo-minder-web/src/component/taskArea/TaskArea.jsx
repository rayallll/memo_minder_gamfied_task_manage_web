// TaskArea.jsx
import './TaskArea.css';
import TaskButton from '../taskButton/TaskButton';
import React, { useState, useEffect } from 'react';
import TaskAreaDialog from './TaskAreaDialog';
import Popup from '../popup/Popup';

const TaskArea = ({ 
    updateHealth, updateLevel, coin, updateCoin, decreaseCoin,
    habits = [], dailies = [], todos = [], rewards = [],
    onAddHabit, onUpdateHabit, onDeleteHabit,
    onAddDaily, onUpdateDaily, onDeleteDaily,
    onAddTodo, onUpdateTodo, onDeleteTodo,
    onAddReward, onUpdateReward, onDeleteReward

}) => {

    //console.log('TaskArea habits prop:', habits);
    //console.log('TaskArea dailies prop:', dailies);
    //console.log('TaskArea todos prop:', todos);
    //console.log('TaskArea rewards prop:', rewards);
    // handle with the inputs
    const [habitInput, setHabitInput] = useState('');
    const [dailyInput, setDailyInput] = useState('');
    const [todoInput, setTodoInput] = useState('');
    const [rewardInput, setRewardInput] = useState('');

    // Enter to add a habit, daily, to-do, reward
    const handleItemKeyPress = (input, setInput, addItem, itemOptions) => (event) => {
        if (event.key === 'Enter') {
            const trimmedInput = input.trim();
            if (trimmedInput) {
                const newItem = {
                    id: Date.now(),
                    content: trimmedInput,
                    ...itemOptions
                };
                addItem(newItem);
                console.log('New habits after adding:', newItem);
                setInput('');
            }
        }
    };

    const handleHabitKeyPress = handleItemKeyPress(habitInput, setHabitInput, onAddHabit, { positive: true, negative: true });
    let currentDate = new Date();
    const handleDailyKeyPress = handleItemKeyPress(dailyInput, setDailyInput, onAddDaily, { startDate: currentDate.toLocaleDateString(), repeats: "daily", "repeatEvery": "1", completed: false });
    currentDate.setDate(currentDate.getDate() + 7);
    const handleTodoKeyPress = handleItemKeyPress(todoInput, setTodoInput, onAddTodo, { dueDate: currentDate.toLocaleDateString(), completed: false });
    const handleRewardKeyPress = handleItemKeyPress(rewardInput, setRewardInput, onAddReward, {price: 10});
   
    // 有bug
    const handlePositiveClick = (habitId) => {
        console.log(`handlePositiveClick called with habitId: ${habitId}`);
        // add logic to increase gold and experience
        //addMessage("You get some Gold and Experience", 'positive');
        updateCoin(); 
        updateLevel(); 
        console.log('After updateLevel called');
        /*
        const habit = habits.find(h => h._id === habitId);
        console.log('habit:', habit);
        const updatedHabit = {
            ...habit,
            habitId: habit._id,
            positiveCount: (habit.positiveCount || 0) + 1
        };
        console.log('updated habit:', updatedHabit);
        console.log('habitID:', habitId);
        onUpdateHabit(habitId, updatedHabit);
        console.log('onUpdateHabit');
        */
    };
    const handleNegativeClick = (habitId) => {
        console.log(`handleNegativeClick called with habitId: ${habitId}`);
        // add logic to decrease health
        //addMessage("You lose some Health", 'negative');
        updateHealth(); 
        console.log('After updateHealth called');
    };

    const handlePayReward = (reward) => {
        // const reward = rewards.find(p => p.id === rewardId);
        console.warn('handlePayReward: ', reward);
        if (coin >= reward?.cost){
            decreaseCoin(reward.cost);
            showCustomPopup("Purchase Successful", `You have successfully purchased: ${reward.content}.`, "rgba(8,186,255, 0.7)"); 
        } else {
            showCustomPopup ("Purchase Failed", "You do not have enough coins.", "rgba(243, 97, 105, 0.7)");
        }
        
    }
    /* shopArea Popup */
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
    const closePopup = () => {
        setShowPopup(false);
    };
    const showCustomPopup = (title, body, background_color) => {
        console.log('showCustomPopup called')
        setPopupMessage({ title, body, background_color });
        setShowPopup(true);
    };

    // handle within dialog
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState('');

    const handleItemClick = (item, type) => {
        setEditingItem(item);
        setEditingType(type);
        setEditDialogVisible(true);
    };

    // save items in dialog
    const handleSaveItem = (updatedItem) => {
        switch (editingType) {
            case 'Habit':
                const { habitId, ...rest } = updatedItem;
                console.log("updatedItem",updatedItem);
                onUpdateHabit(habitId, rest);
                break;
            case 'Daily':
                const { dailyId, ...restdaily } = updatedItem;
                console.log("updatedItem",updatedItem);
                onUpdateDaily(dailyId, restdaily);
                break;
            case 'To-Do':
                const { todoId, ...resttodo } = updatedItem;
                console.log("updatedItem",updatedItem);
                onUpdateTodo(todoId, resttodo);
                break;
            case 'Reward':
                const { rewardId, ...restreward } = updatedItem;
                console.log("updatedItem",updatedItem);
                onUpdateReward(rewardId, restreward);
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    // delete items in dialog
    const handleDeleteItem = (itemToDelete) => {
        switch (editingType) {
            case 'Habit':
                const { habitId} = itemToDelete;
                onDeleteHabit(habitId);
                break;
            case 'Daily':
                const { dailyId} = itemToDelete;
                onDeleteDaily(dailyId);
                break;
            case 'To-Do':
                const { todoId} = itemToDelete;
                onDeleteTodo(todoId);
                break;
            case 'Reward':
                const { rewardId} = itemToDelete;
                onDeleteReward(rewardId);
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    // 1. 初始化状态
    const [completedItems, setCompletedItems] = useState(() => {
        const saved = localStorage.getItem('completedItems');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // 2. 当completedItems变化时，更新本地存储
    useEffect(() => {
        localStorage.setItem('completedItems', JSON.stringify([...completedItems]));
    }, [completedItems]);

    // 处理完成点击
    const handleCompleteClick = (id) => {
        setCompletedItems(prev => {
            const newSet = new Set(prev);
            if (!newSet.has(id)) {
                newSet.add(id);
            }
            return newSet;
        });
    };
      
/* daily and to-do tasks completion
    const toggleItemCompletion = (items, updateItem) => (id, completed) => {
        // Find the item to update
        const itemToUpdate = items.find(item => item.id === id);
        // If found, update that item's completed status
        if (itemToUpdate) {
            updateItem({ ...itemToUpdate, completed });
        }
    };
    const toggleDailyCompletion = toggleItemCompletion(dailies, onUpdateDaily);
    const toggleTodoCompletion = toggleItemCompletion(todos, onUpdateTodo);
    
    //handle marking a daily as completed or not
    const markDailyAsCompleted = (dailyId) => {
        toggleDailyCompletion(dailyId, true);
        updateLevel();
        updateCoin(); 
    };
    const markDailyAsIncomplete = (dailyId) => {
        toggleDailyCompletion(dailyId, false);
    };
    // handle marking a to-do as completed or not
    const markTodoAsCompleted = (todoId) => {
        toggleTodoCompletion(todoId, true);
        updateLevel();
        updateCoin(); 
    };
    const markTodoAsIncomplete = (todoId) => {
        toggleTodoCompletion(todoId, false);
    };
    */
    /* set Selected Tab
    const [selectedHabitTab, setSelectedHabitTab] = useState('All');
    const [selectedDailyTab, setSelectedDailyTab] = useState('All');
    const [selectedTodoTab, setSelectedTodoTab] = useState('All');
 
    // Generic function to filter items based on tab selection
    const filterItemsByTab = (items, selectedTab, tabMap) => {
        switch (selectedTab) {
            case tabMap.feature1:
                return items.filter(item => tabMap.condition1(item));
            case tabMap.feature2:
                return items.filter(item => tabMap.condition2(item));
            default: 
                return items;
        }
    };
    const habitTabMap = {
        feature1: 'Good Habits',
        feature2: 'Bad Habits',
        condition1: (item) => item.positive && !item.negative,
        condition2: (item) => !item.positive && item.negative
      };
      
      const dailyTabMap = {
        feature1: 'Due',
        feature2: 'Completed',
        condition1: (item) => !item.completed,
        condition2: (item) => item.completed
      };
      
      const todoTabMap = {
        feature1: 'Scheduled',
        feature2: 'Completed',
        condition1: (item) => !item.completed,
        condition2: (item) => item.completed
      };

    //  keep track of the selected tab
    const filteredHabits = filterItemsByTab(habits, selectedHabitTab, habitTabMap);
    const filteredDailies = filterItemsByTab(dailies, selectedDailyTab, dailyTabMap);
    const filteredTodos = filterItemsByTab(todos, selectedTodoTab, todoTabMap);

    // Right before the return statement to log the filtered habits before rendering
    console.debug('Filtered habits before rendering:', filteredHabits);
    */

    return (
        <div className="taskAreaContainer">
            <Popup show={showPopup} onClose={closePopup} message={popupMessage} />
            <div className="controlButton">
                <TaskButton 
                    onAddHabit={onAddHabit}
                    onAddDaily={onAddDaily}
                    onAddTodo={onAddTodo}
                    onAddReward = {onAddReward}
                />
            </div>
            <div className="taskAreaSections">
                {/* Habits Section */}
                <div className="taskAreaSection">
                    <h2>Habits</h2>
                    {/* First version: Weak/ Strong features change to Good/Bad habits*/}
                    <div className="taskAreaNav">
                        <button >All Habit Tasks</button>
                        {/*<button onClick={() => setSelectedHabitTab ("Good Habits")}>Good</button>*/} 
                        {/*<button onClick={() => setSelectedHabitTab ("Bad Habits")}>Bad</button>*/}
                    </div>
                    <div className="contentContainer">
                        <div className="habitInputContainer">
                            <input
                                type="text"
                                placeholder="Add a habit"
                                value={habitInput}
                                onChange={(e) => setHabitInput(e.target.value)}
                                onKeyDown={handleHabitKeyPress}
                                className="habitInput"
                            />
                        </div>
                        {/* Habit List */}
                        <div className="taskList">
                            {/* Individual Habit Item */}
                            {habits.map(habit => {
                                //console.debug('Rendering habit with key:', habit._id);
                                return (
                                    <div className="habitItem" key={habit._id}>
                                      {(habit.type === 'positive' || habit.type === 'both') && (
                                        <button onClick={() => handlePositiveClick(habit._id)}>+</button>
                                      )}
                                      <p onClick={() => handleItemClick(habit, 'Habit')}>{habit.title}</p>
                                      {(habit.type === 'negative' || habit.type === 'both') && (
                                        <button onClick={() => handleNegativeClick(habit._id)}>-</button>
                                      )}
                                    </div>
                                  );
                            })}
                            {/* Add more habit items here */}
                        </div>
                    </div>
                </div>

                {/* Dailies Section */}
                <div className="taskAreaSection">
                    <h2>Dailies</h2>
                    <div className="taskAreaNav">
                        <button >All Daily Tasks</button>
                        {/*<button onClick={() => setSelectedDailyTab('Due')}>Due</button>*/}
                        {/*<button onClick={() => setSelectedDailyTab('Completed')}>Completed</button>*/}
                    </div>
                    <div className="contentContainer">
                        <div className="dailyInputContainer">
                            <input
                                type="text"
                                placeholder="Add a daily"
                                value={dailyInput}
                                onChange={(e) => setDailyInput(e.target.value)}
                                onKeyDown={handleDailyKeyPress}
                                className="dailyInput"
                            />
                        </div>
                        {/* Daily List */}
                        <div className="taskList">
                            {dailies.map(daily => {
                                console.debug('Rendering daily with key:', daily._id);
                                const isCompleted = completedItems.has(daily._id);
                                return (
                                    <div className={`dailyItem ${isCompleted ? 'completed' : ''}`} key={daily._id}>
                                  
                                    <button 
                                      onClick={(e) => {
                                          e.stopPropagation(); 
                                          handleCompleteClick(daily._id); 
                                      }}
                                      disabled={isCompleted} 
                                      style={{ 
                                          opacity: isCompleted ? 0.5 : 1, 
                                          cursor: isCompleted ? 'not-allowed' : 'pointer'
                                      }}>
                                      +
                                    </button>
                                    <p 
                                       style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                                        {daily.title}
                                    </p>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* To Do Lists Section */}
                <div className="taskAreaSection">
                    <h2>To Do Lists</h2>
                    <div className="taskAreaNav">
                        <button>All To-Do Lists</button>
                        {/*<button onClick={() => setSelectedTodoTab('Scheduled')}>Scheduled</button>*/}
                        {/*<button onClick={() => setSelectedTodoTab('Completed')}>Completed</button>*/}
                    </div>
                    <div className="contentContainer">
                        <div className="todoInputContainer">
                            <input
                                type="text"
                                placeholder="Add a To Do"
                                value={todoInput}
                                onChange={(e) => setTodoInput(e.target.value)}
                                onKeyDown={handleTodoKeyPress}
                                className="todoInput"
                            />
                        </div>

                        {/* To Do List */}
                        <div className="taskList">
                            {todos.map(todo => {
                                console.debug('Rendering daily with key:', todo._id);
                                const isCompleted = completedItems.has(todo._id);
                                return (
                                    <div className={`todoItem ${isCompleted ? 'completed' : ''}`} key={todo._id}>
                                  
                                    <button 
                                      onClick={(e) => {
                                          e.stopPropagation(); 
                                          handleCompleteClick(todo._id); 
                                      }}
                                      disabled={isCompleted} 
                                      style={{ 
                                          opacity: isCompleted ? 0.5 : 1, 
                                          cursor: isCompleted ? 'not-allowed' : 'pointer'
                                      }}>
                                      +
                                    </button>
                                    <p 
                                       style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                                        {todo.title}
                                    </p>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* Rewards Section */}
                <div className="rewardAreaSection">
                    <h2>Rewards</h2>
                    <div className="taskAreaNav">
                        <button >Customizable Rewards</button>
                    </div>
                    <div className="contentContainer">
                        <div className="rewardInputContainer">
                            <input
                                type="text"
                                placeholder="Add a Reward"
                                value={rewardInput}
                                onChange={(e) => setRewardInput(e.target.value)}
                                onKeyDown={handleRewardKeyPress}
                                className="rewardInput"
                            />
                        </div>
                        <div className="rewardList">
                            {rewards.map(reward => {
                                console.debug('Rendering reward with key:', reward._id);
                                return (
                                <div className="rewardItem" key={reward._id}>
                                    <button onClick={() => handlePayReward(reward)}>
                                        {reward.cost} coins
                                    </button>
                                    <p>{reward.title}
                                    </p>
                                </div>
                            )})}
                        </div>
                    </div> 
                </div>

            </div>
            {editDialogVisible && editingItem && (
                <TaskAreaDialog
                    item={editingItem}
                    editingType={editingType} //'Habit', 'Daily', 'To-do', 'Reward'
                    onClose={() => setEditDialogVisible(false)}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                />
            )}
        </div>
    );
}

export default TaskArea;
