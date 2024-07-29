import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './MilestonesArea.css';
import { BASE_URL, SERVER_API } from '../../utils/constants';
import { getAuthInfo } from '../../utils/auth';

const Milestone = ({ leftImage, subscript, text, rightImage, completedCount, totalCount }) => {
    if (completedCount > totalCount) {
        completedCount = totalCount;
    }
    const progressText = `${completedCount}/${totalCount}`;
    const progressPercentage = (completedCount / totalCount) * 100;

    return (
        <div className="milestone">
            <div className="left-icon-container">
                <img src={leftImage} alt="" className="icon left-icon" />
                <span className="multiplier">{subscript}</span>
            </div>
            <div className="text">{text}</div>
            <div className="progress-bar-container">
                <div className="progress-bar-background">
                    <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="progress-text">{progressText}</div>
            </div>
            <img
                src={rightImage}
                alt=""
                className="icon right-icon"
                style={{
                    filter: progressPercentage < 100 ? 'grayscale(100%)' : 'none'
                }}
            />
        </div>
    );
};


const MilestonesArea = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [dailiesAdded, setDailiesAdded] = useState(0);
    const [habitsAdded, setHabitsAdded] = useState(0);
    const [rewardsAdded, setRewardsAdded] = useState(0);
    const [todosAdded, setTodosAdded] = useState(0);

    useEffect(() => {
        const queryHistory = async () => {
            console.debug('queryHistory');
            try {
                let auth = getAuthInfo();
                let id = auth.id;
                console.warn(SERVER_API.QUERY_HISTORY + id);
                const response = await axios.get(BASE_URL + SERVER_API.QUERY_HISTORY + id, {
                    'userId': id
                });
                let history = response?.data?.history;
                if (history) {
                    setDailiesAdded(history.dailiesAdded);
                    setHabitsAdded(history.habitsAdded);
                    setRewardsAdded(history.rewardsAdded);
                    setTodosAdded(history.todosAdded);
                }
                const completedRightImages = [];

                milestonesData.forEach(milestone => {
                    if (milestone.completedCount >= milestone.totalCount) {
                    console.warn("milestone: ", milestone)
                        completedRightImages.push(milestone.rightImage);
                    }
                });
            
                // console.log(completedRightImages);
                
                if (completedRightImages.length > JSON.parse(localStorage.getItem('milestoneImages') || '[]').length) {
                    localStorage.setItem('milestoneImages', JSON.stringify(completedRightImages)); // update in localStorage
                    console.error("refresh localstorage");
                  } 

            } catch (error) {
                console.warn('query history error:', error);
            }
        }

        queryHistory();
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render

    const milestonesData = [
        {
            leftImage: '/warrior.png',
            subscript: 'Warrior',
            text: 'Fight once',
            rightImage: '/crystal6.png',
            completedCount: 1,
            totalCount: 1
        },
        {
            leftImage: '/daily.png',
            subscript: '3 Perfect Days',
            text: 'Completed all active Dailies on 3 days',
            rightImage: '/crystal5.png',
            completedCount: 0,
            totalCount: 3
        },
        {
            leftImage: '/habit.png',
            subscript: 'Habit Planner',
            text: 'Add 3 Habits',
            rightImage: '/crystal7.png',
            completedCount: habitsAdded,
            totalCount: 3
        },
        {
            leftImage: '/daily.png',
            subscript: 'Daily Planner',
            text: 'Add 3 Dailies',
            rightImage: '/crystal8.png',
            completedCount: dailiesAdded,
            totalCount: 3
        },
        {
            leftImage: '/todo.png',
            subscript: 'Todo Planner',
            text: 'Add 3 Todo\'s',
            rightImage: '/crystal9.png',
            completedCount: todosAdded,
            totalCount: 3
        },
        {
            leftImage: '/reward.png',
            subscript: 'Daydreamer',
            text: 'Add  Rewards',
            rightImage: '/crystal10.png',
            completedCount: rewardsAdded,
            totalCount: 3
        },
        // {
        //     leftImage: '/habit.png',
        //     subscript: 'Habit Champion',
        //     text: 'Complete 3 Habits',
        //     rightImage: 'crystal0.png',
        //     completedCount: 1,
        //     totalCount: 3
        // },
        // {
        //     leftImage: '/daily.png',
        //     subscript: 'Daily Champion',
        //     text: 'Complete 3 Dailies',
        //     rightImage: '/crystal12.png',
        //     completedCount: 0,
        //     totalCount: 3
        // },
        // {
        //     leftImage: '/todo.png',
        //     subscript: 'Todo Champion',
        //     text: 'Complete 3 Todo\'s',
        //     rightImage: '/crystal2.png',
        //     completedCount: 2,
        //     totalCount: 3
        // },
        // {
        //     leftImage: '/reward.png',
        //     subscript: 'Fulfilled Dreamer',
        //     text: 'Gain 3 Rewards',
        //     rightImage: '/crystal3.png',
        //     completedCount: 3,
        //     totalCount: 3
        // },
    ];

    const milestonesPerPage = 8;
    const totalPages = Math.ceil(milestonesData.length / milestonesPerPage);

    const currentMilestones = milestonesData.slice(
        currentPage * milestonesPerPage,
        (currentPage + 1) * milestonesPerPage
    );

    const leftBoxMilestones = currentMilestones.slice(0, milestonesPerPage / 2);
    const rightBoxMilestones = currentMilestones.slice(milestonesPerPage / 2);

    return (
        <div className="milestones-container">
            {leftBoxMilestones.length > 0 && (
                <div className="milestone-box">
                    {leftBoxMilestones.map((milestone, index) => (
                        <Milestone key={index} {...milestone} />
                    ))}
                </div>
            )}
            {rightBoxMilestones.length > 0 && leftBoxMilestones.length > 0 && (
                <div className="milestone-box">
                    {rightBoxMilestones.map((milestone, index) => (
                        <Milestone key={index} {...milestone} />
                    ))}
                </div>
            )}
            {milestonesData.length > milestonesPerPage && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)} className="page-btn">{"<"}</button>
                    <span className="page-number">{`${currentPage + 1}/${totalPages}`}</span>
                    <button onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)} className="page-btn">{">"}</button>
                </div>
            )}
        </div>
    );
};

export default MilestonesArea;
