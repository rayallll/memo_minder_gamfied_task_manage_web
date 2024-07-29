import axios from 'axios';
import React, { useState, useEffect, useCallback} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import './App.css';
import Navbar from './component/navBar/NavBar';
import { Login } from "./pages/login/Login"
import { Register } from './pages/register/Register';
import Home from './pages/Home/Home';
import Header from './component/header/Header'
import TaskArea from './component/taskArea/TaskArea'
import ShopArea from "./component/shopArea/ShopArea";
import ChallengeArea from './component/challengeArea/ChallengeArea';
import Popup from './component/popup/Popup';
import MilestonesArea from './component/milestonesArea/MilestonesArea';
import {BASE_URL, STATUS_CODE, SERVER_API} from './utils/constants'
import { getAuthInfo, clearAuthInfo } from './utils/auth'


function App() {
  /* 
  limitation to get access to home page 
  before login (change to false to apply)
  */

  console.debug('App');

  let authInfo = getAuthInfo();
  let token = authInfo?.token;
  let id = authInfo?.id;

  // const currentUser = !!authInfo;

  /* Popup */
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
  const closePopup = () => {
    setShowPopup(false);
  };
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
  };
  /* 
  health bar 
  Get initial health from local storage,
  default to 100 if not found
  -10 per update
  */
  const initialHealth = parseInt(localStorage.getItem('health')) || 100;
  const [health, setHealth] = useState(initialHealth);
  const updateHealth = () => {
    setHealth(prevHealth => {
      const newHealth = prevHealth - 10;
      if (newHealth <= 0) {
        showCustomPopup("Health Depleted", "Your health has depleted to zero. Try upgrading to restore full health.", "rgba(243, 97, 105, 0.7)");
        return 0; 
      }
      return newHealth;
    });
  };
  /* 
  level bar 
  Get initial level from local storage,
  default to 0 if not found
  +1Q per update
  */
  const initialLevel = parseInt(localStorage.getItem('level')) || 1;
  const [level, setLevel] = useState(initialLevel);
  const initialExperience = parseInt(localStorage.getItem('experience')) || 0;
  const [experience, setExperience] = useState(initialExperience);
  const updateLevel = () => {
    const newExperience = experience + 20;
    setExperience(newExperience);
    if (newExperience >= 100) {
      setLevel(prevLevel => prevLevel + Math.floor(newExperience / 100));
      setExperience(0);
      setHealth(100);
      showCustomPopup("Level Up", "Congratulations! You've leveled up!", "rgba(255, 204, 85, 0.7)");
    }
  };
  /* 
  coin  
  +1Q per task
  decrease corresponding coins 
  from purchasing items in shop
  */
  const initialCoin = parseInt(localStorage.getItem('coin')) || 0;
  const [coin, setCoin] = useState(initialCoin);
  const updateCoin = () => {
    setCoin(prevCoin => {
      const newCoin = prevCoin + 10;
      return newCoin;
    });
  };
  const WolfCoinReward = () => {
    setCoin(prevCoin => {
      const newCoin = prevCoin + 50;
      return newCoin;
    });
  };
  const CatCoinReward = () => {
    setCoin(prevCoin => {
      const newCoin = prevCoin + 80;
      return newCoin;
    });
  };
  const decreaseCoin = (price) => {
    setCoin(prevCoin => {
      // let coin >= 0
      const newCoin = Math.max(0, prevCoin - price);
      localStorage.setItem('coin', newCoin); // update in localStorage
      return newCoin;
    });
    showCustomPopup("Purchase Successfully", "You have purchased an item.", "rgba(8,186,255, 0.7)");
  };


  useEffect(() => {
    // Save health & level to local storage whenever it changes
    localStorage.setItem('health', health.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('experience', experience.toString());
    localStorage.setItem('coin', coin.toString());
  }, [health, level, experience, coin]);

  /* 
  TaskArea:
  Habit, Daily, To-do, reward
  */
  const [habits, setHabits] = useState([]); 
  const [dailies, setDailies] = useState([]);
  const [todos, setTodos] = useState([]);
  const [rewards, setRewards] = useState([]); 

  // TODO: task数据从server获取后 增删改的回调函数逻辑是否回组件内部 来不及了不改了
    // habit component
    const fetchHabits = useCallback(async () => {
      try {
        const fetchHabitsUrl = `${BASE_URL}${SERVER_API.FETCH_HABIT.replace(':userId', id)}`;
        const response = await axios.get(fetchHabitsUrl, {
          headers: {
            'Authorization': token,
          },
        });
  
        console.log('Fetched habits:', response.data);
        console.log('Habits in response:', response.data.habits);
        // Assuming the habits are in response.data.habits
        if (response.data && Array.isArray(response.data.habits)) {
          setHabits(response.data.habits);
          console.log('Habits state after update:', habits);
        } else {
          console.error('Data fetched is not in the expected format:', response.data);
        }
  
      } catch (error) {
        console.error('Failed to fetch habits:', error);
      }
    },[token]);
  
    useEffect(() => {
      fetchHabits();
    }, [fetchHabits]);
  
    const addHabitToServer = async (habit) => {
      try {
        console.debug('addHabitToServer:', habit);
        //if (!habit?.content || !habit?.notes) {
        if (!habit?.content) {
          console.warn('invalid habit, no need to post');
          return;
        }
        const response = await axios.post(BASE_URL + SERVER_API.ADD_HABIT, {
          'title': habit.content,
          'type': habit.positive && habit.negative ? 'both' : !habit.positive && !habit.negative ? 'neutral' : habit.positive ? 'positive' : 'negative',
          'note': habit.notes
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        console.debug('post new habit success:', response.status);
      } catch (error) {
        console.warn('post new habit error:', error);
        if (error.response.status === STATUS_CODE.UNAUTHORIZED) {
          // Navigate("/Login");
        }
      }
    };
    const addHabit = (habit) => {
      setHabits(prev => [...prev, habit])
      addHabitToServer(habit);
      fetchHabits();
    };

  const updateHabitToServer = async (habitId, updatedHabit) => {
    try {
      console.debug('updateHabitToServer:', updatedHabit);
      console.log('habit to be updated-old:',habitId)
      console.log('habit to be updated-new:',updatedHabit)
      const updateHabitsUrl = `${BASE_URL}${SERVER_API.MODIFY_HABIT.replace(':habitId', habitId)}`;
      const response = await axios.put(updateHabitsUrl , {
        'title': updatedHabit.content,
        'type': updatedHabit.types,
        'note': updatedHabit.notes,
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      console.log("after update", response)
      console.debug('update habit success:', response.status);
    } catch (error) {
      if (error.response.status === STATUS_CODE.UNAUTHORIZED) {
        // Navigate("/Login");
      }
    }
  };

  const updateHabit = async (habitId, updatedHabit) => {
    await updateHabitToServer(habitId, updatedHabit);
    fetchHabits(); 
  };

  //delete habit
  const deleteHabitFromServer = async (habitId) => {
    try {
      console.debug('deleteHabitFromServer:', habitId);
      console.log('Habit to be delete:', habitId);
      const deleteHabitsUrl = `${BASE_URL}${SERVER_API.DELETE_HABIT.replace(':habitId', habitId)}`;
      const response = await axios.delete(deleteHabitsUrl, {
        headers: {
          'Authorization': token
        }
      });
      console.debug('delete habit success:', response.status);
    } catch (error) {
      console.error('delete habit error:', error);
      if (error.response.status === STATUS_CODE.UNAUTHORIZED) {
        // Navigate("/Login");
      }
    }
  };
  const deleteHabit = async (habitId) => {
    await deleteHabitFromServer(habitId);
    fetchHabits();
  };

    // daily component
    const fetchDailies = useCallback(async () => {
      try {
        // Assuming SERVER_API.FETCH_DAILIES is the correct endpoint for fetching dailies
        const fetchDailiesUrl = `${BASE_URL}${SERVER_API.FETCH_DAILY.replace(':userId', id)}`;
        const response = await axios.get(fetchDailiesUrl, {
          headers: {
            'Authorization': token,
          },
        });
    
        console.log('Fetched dailies:', response.data);
        // check response.data.dailies
        console.log('Dailies in response:', response.data.dailies);
        // Assuming the dailies are in response.data.dailies
        if (response.data && Array.isArray(response.data.dailies)) {
          setDailies(response.data.dailies); 
          console.log('Dailies state after update:', dailies);
        } else {
          console.error('Data fetched is not in the expected format:', response.data);
        }
    
      } catch (error) {
        console.error('Failed to fetch dailies:', error);
      }
    }, [token]);
    
    useEffect(() => {
      fetchDailies();
    }, [fetchDailies]); 

    // Add Daily to the server
    const addDailyToServer = async (daily) => {
      try {
        console.debug('addDailyToServer:', daily);
        if (!daily?.content) {
          console.warn('Invalid daily, no need to post');
          return;
        }
        const response = await axios.post(`${BASE_URL}${SERVER_API.ADD_DAILY}`, {
          'title': daily.content,
          'note': daily.notes,
          "startDate": daily.startDate,
          "repeats": daily.repeats,
          "repeatEvery": daily.repeatEvery
          // Include other necessary fields
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        console.debug('Post new daily success:', response.status);
      } catch (error) {
        console.warn('Post new daily error:', error);
        // Include error handling logic here
      }
    };

    const addDaily = (daily) => {
      setDailies(prev => [...prev, daily]);
      addDailyToServer(daily);
      fetchDailies();
    };

    // Update Daily on the server
    const updateDailyToServer = async (dailyId, updatedDaily) => {
      try {
        console.debug('updateDailyToServer:', updatedDaily);
        const updateDailiesUrl = `${BASE_URL}${SERVER_API.MODIFY_DAILY.replace(':dailyId', dailyId)}`;
        const response = await axios.put(updateDailiesUrl, {
          'title': updatedDaily.content,
          'note': updatedDaily.notes,
          'startDate': updatedDaily.startDate,
          'repeats': updatedDaily.repeats,
          'repeatEvery': updatedDaily.repeatEvery,
          'completed': updatedDaily.completed
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        console.debug('Update daily success:', response.status);
      } catch (error) {
        console.error('Update daily error:', error);
        // Include error handling logic here
      }
    };

    const updateDaily = async (dailyId, updatedDaily) => {
      await updateDailyToServer(dailyId, updatedDaily);
      fetchDailies(); 
    };

    // Delete Daily from the server
    const deleteDailyFromServer = async (dailyId) => {
      try {
        console.debug('deleteDailyFromServer:', dailyId);
        const deleteDailiesUrl = `${BASE_URL}${SERVER_API.DELETE_DAILY.replace(':dailyId', dailyId)}`;
        const response = await axios.delete(deleteDailiesUrl, {
          headers: {
            'Authorization': token
          }
        });
        console.debug('Delete daily success:', response.status);
      } catch (error) {
        console.error('Delete daily error:', error);
        // Include error handling logic here
      }
    };

    const deleteDaily = async (dailyId) => {
      await deleteDailyFromServer(dailyId);
      fetchDailies();
    };

    // todo component
    const fetchTodos = useCallback(async () => {
      try {
        // Replace .FETCH_HABIT with the correct endpoint for fetching todos, if different
        const fetchTodosUrl = `${BASE_URL}${SERVER_API.FETCH_TODOS.replace(':userId', id)}`;
        const response = await axios.get(fetchTodosUrl, {
          headers: {
            'Authorization': token,
          },
        });
    
        console.log('Fetched todos:', response.data);
        // Replace 'habits' with the correct property that holds the todos, if different
        console.log('Todos in response:', response.data.todos);
        // Assuming the todos are in response.data.todos
        if (response.data && Array.isArray(response.data.todos)) {
          setTodos(response.data.todos); // Use the appropriate state updater for todos
          console.log('Todos state after update:', todos); // Log the updated todos state
        } else {
          console.error('Data fetched is not in the expected format:', response.data);
        }
    
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    }, [token]); 
    
    useEffect(() => {
      fetchTodos();
    }, [fetchTodos]); // Update the useEffect hook to call fetchTodos
    // Add Todo to the server
const addTodoToServer = async (todo) => {
  try {
    console.debug('addTodoToServer:', todo);
    if (!todo?.content) {
      console.warn('Invalid todo, no need to post');
      return;
    }
    const response = await axios.post(`${BASE_URL}${SERVER_API.ADD_TODOS}`, {
      'title': todo.content,
      'note': todo.notes,
      'dueDate': todo.dueDate
      // Include other necessary fields like 'completed', 'deadline', etc.
    }, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    console.debug('Post new todo success:', response.status);
  } catch (error) {
    console.warn('Post new todo error:', error);
  }
};

const addTodo = (todo) => {
  setTodos(prev => [...prev, todo]);
  addTodoToServer(todo);
  fetchTodos();
};

// Update Todo on the server
const updateTodoToServer = async (todoId, updatedTodo) => {
  try {
    console.debug('updateTodoToServer:', updatedTodo);
    const updateTodosUrl = `${BASE_URL}${SERVER_API.MODIFY_TODOS.replace(':todoId', todoId)}`;
    const response = await axios.put(updateTodosUrl, {
      'title': updatedTodo.content,
      'note': updatedTodo.notes,
      'dueDate': updatedTodo.dueDate
    }, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    console.debug('Update todo success:', response.status);
  } catch (error) {
    console.error('Update todo error:', error);
  }
};

const updateTodo = async (todoId, updatedTodo) => {
  await updateTodoToServer(todoId, updatedTodo);
  fetchTodos(); 
};

// Delete Todo from the server
const deleteTodoFromServer = async (todoId) => {
  try {
    console.debug('deleteTodoFromServer:', todoId);
    const deleteTodosUrl = `${BASE_URL}${SERVER_API.DELETE_TODOS.replace(':todoId', todoId)}`;
    const response = await axios.delete(deleteTodosUrl, {
      headers: {
        'Authorization': token
      }
    });
    console.debug('Delete todo success:', response.status);
  } catch (error) {
    console.error('Delete todo error:', error);
  }
};

const deleteTodo = async (todoId) => {
  await deleteTodoFromServer(todoId);
  fetchTodos();
};

  // reward component
  const fetchRewards = useCallback(async () => {
    try {
      // Replace .FETCH_TODOS with the correct endpoint for fetching rewards
      const fetchRewardsUrl = `${BASE_URL}${SERVER_API.FETCH_REWARD.replace(':userId', id)}`;
      const response = await axios.get(fetchRewardsUrl, {
        headers: {
          'Authorization': token,
        },
      });
  
      console.log('Fetched rewards:', response.data);
      // Replace 'todos' with the correct property that holds the rewards, if it's different
      console.log('Rewards in response:', response.data.rewards);
      // Assuming the rewards are in response.data.rewards
      if (response.data && Array.isArray(response.data.rewards)) {
        setRewards(response.data.rewards); // Use the appropriate state updater for rewards
        console.log('Rewards state after update:', response.data.rewards); // Log the updated rewards state
      } else {
        console.error('Data fetched is not in the expected format:', response.data);
      }
  
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    }
  }, [token]); // Add dependencies to the dependency array
  
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const onLogin = () => {
    authInfo = getAuthInfo();
    token = authInfo?.token;
    id = authInfo?.id;
    fetchTodos();
  };

  const addRewardToServer = async (reward) => {
    try {
      console.debug('addRewardToServer:', reward);
      if (!reward?.content) {
        console.warn('Invalid reward, no need to post');
        return;
      }
      const response = await axios.post(`${BASE_URL}${SERVER_API.ADD_REWARD}`, {
        'title': reward.content,
        'note': reward.notes, // Adjust according to the actual structure of a reward
        'cost': reward.price
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      console.debug('Post new reward success:', response.status);
    } catch (error) {
      console.warn('Post new reward error:', error);
    }
  };
  
  const addReward = (reward) => {
    setRewards(prev => [...prev, reward]);
    addRewardToServer(reward);
    fetchRewards();
  };
  
  // Update Reward on the server
  const updateRewardToServer = async (rewardId, updatedReward) => {
    try {
      console.debug('updateRewardToServer:', updatedReward);
      const updateRewardsUrl = `${BASE_URL}${SERVER_API.MODIFY_REWARD.replace(':rewardId', rewardId)}`;
      const response = await axios.put(updateRewardsUrl, {
        'title': updatedReward.content,
        'note': updatedReward.notes,
        'cost': updatedReward.price
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      console.debug('Update reward success:', response.status);
    } catch (error) {
      console.error('Update reward error:', error);
    }
  };
  
  const updateReward = async (rewardId, updatedReward) => {
    await updateRewardToServer(rewardId, updatedReward);
    fetchRewards(); 
  };
  
  // Delete Reward from the server
  const deleteRewardFromServer = async (rewardId) => {
    try {
      console.debug('deleteRewardFromServer:', rewardId);
      const deleteRewardsUrl = `${BASE_URL}${SERVER_API.DELETE_REWARD.replace(':rewardId', rewardId)}`;
      const response = await axios.delete(deleteRewardsUrl, {
        headers: {
          'Authorization': token
        }
      });
      console.debug('Delete reward success:', response.status);
    } catch (error) {
      console.error('Delete reward error:', error);
    }
  };
  
  const deleteReward = async (rewardId) => {
    await deleteRewardFromServer(rewardId);
    fetchRewards();
  };


  const clearStorageAndResetStates = () => {
    // clear all localStorage
    localStorage.clear();
    // update to default state
    setHealth(100);
    setExperience(0);
    setCoin(0);
    setLevel(1);
    
  };
  
  /*-Transfer for different Areas start-*/
  const [showTaskArea, setShowTaskArea] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const handleTaskClick = () => {
    setShowTaskArea(true);
    setShowShop(false);
    setShowMilestones(false);
  };
  const handleShopClick = () => {
    setShowTaskArea(false);
    setShowShop(true);
    setShowMilestones(false);
  };
  const handleChallengeClick = () => {
    setShowTaskArea(false);
    setShowShop(false);
    setShowChallenge(true);
    setShowMilestones(false);
  };
  const handleMilestonesClick = () => {
    setShowTaskArea(false);
    setShowShop(false);
    setShowChallenge(false);
    setShowMilestones(true);
  };
  /*-Transfer for different Areas end-*/

  const Layout = ({ showTaskArea, showShop, showChallenge, showMilestones, handleTaskClick, handleShopClick, handleChallengeClick, handleMilestonesClick }) => {
    
    return (
        <div>
            {/* Pass handleTaskClick and handleShopClick as props to Navbar component */}
            <Navbar
                handleTaskClick={handleTaskClick}
                handleShopClick={handleShopClick}
                handleChallengeClick={handleChallengeClick}
                handleMilestonesClick={handleMilestonesClick}
                coin={coin}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* pass health props to Header and TaskArea */}
                <Header health={health} experience={experience} level={level}/>
                <Popup show={showPopup} onClose={closePopup} message={popupMessage} />

                {/* TaskArea and ShopArea outside Navbar */}
                <div>
                  {showTaskArea ? (
                      <TaskArea
                          updateHealth={updateHealth}
                          updateLevel={updateLevel}
                          coin={coin}
                          updateCoin={updateCoin}
                          decreaseCoin={decreaseCoin}
                          habits={habits}
                          dailies={dailies}
                          todos={todos}
                          rewards = {rewards}
                          onAddHabit={addHabit}
                          onUpdateHabit={updateHabit}
                          onDeleteHabit={deleteHabit}
                          onAddDaily={addDaily}
                          onUpdateDaily={updateDaily}
                          onDeleteDaily={deleteDaily}
                          onAddTodo={addTodo}
                          onUpdateTodo={updateTodo}
                          onDeleteTodo={deleteTodo}
                          onAddReward = {addReward}
                          onUpdateReward = {updateReward}
                          onDeleteReward = {deleteReward}
                          onClear={clearStorageAndResetStates}
                      />
                  ) : showShop ? (
                      <ShopArea coin={coin} updateCoin={updateCoin} decreaseCoin={decreaseCoin}/>
                  ) : showChallenge ? (
                      <ChallengeArea level={level} coin={coin} WolfCoinReward={WolfCoinReward} CatCoinReward={CatCoinReward}/>
                  ) : <MilestonesArea/>
                }
              </div>

            </div>
        </div>
    );
};



  

  /* -- prevent to access home page before login start -- */
  /* -- 要用的时候把上面那个currentUser改成false就ok -- */
  const ProtectedRoute = ({children}) =>{
    if(!getAuthInfo()){
      return <Navigate to="/login"/>
    }
    return children
  }
  /* -- prevent to access home page before login end -- */

  /* -- page transfer start -- */
  const router = createBrowserRouter([
    {
      path: "/",
      element: 
        <ProtectedRoute>
        <Layout
            showTaskArea={showTaskArea}
            showShop={showShop}
            showChallenge={showChallenge}
            showMilestones={showMilestones}
            handleTaskClick={handleTaskClick}
            handleShopClick={handleShopClick}
            handleChallengeClick={handleChallengeClick}
            handleMilestonesClick={handleMilestonesClick}
        />
        </ProtectedRoute>,
      children:[
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/profile/:id",
          element: <Home/>
        }
      ]
    },
    {
      path: "/login",
      element: <Login handleLoginSuccess={onLogin}/>
    },
    {
      path: "/register",
      element: <Register/>
    },
  ]);
  /* -- page transfer end -- */

  return (
    <div>
      <RouterProvider router={router} />
      <Popup show={showPopup} onClose={closePopup} message={popupMessage} />
    </div>
  );
}


export default App;