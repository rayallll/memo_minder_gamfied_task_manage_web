// constants.js
export const BASE_URL = 'https://memo-minder.onrender.com';

export const STATUS_CODE = {
    SUCCESS: 200,
    ADD_HABIT_SUCCESS: 201,
    UNAUTHORIZED: 401,
};

export const SERVER_API = {
    REGISTER: '/api/users',
    LOGIN: '/api/login',
    ADD_HABIT: '/api/habits',
    FETCH_HABIT: '/api/habits/user/:userId',
    MODIFY_HABIT: '/api/habits/:habitId',
    DELETE_HABIT: '/api/habits/:habitId',

    ADD_DAILY: '/api/dailies',
    FETCH_DAILY: '/api/dailies/user/:userId',
    MODIFY_DAILY: '/api/dailies/:Id',
    DELETE_DAILY: '/api/dailies/:Id',

    ADD_TODOS: '/api/todos',
    FETCH_TODOS: '/api/todos/user/:userId',
    MODIFY_TODOS: '/api/todos/:Id',
    DELETE_TODOS: '/api/todos/:Id',

    ADD_REWARD: '/api/rewards',
    FETCH_REWARD: '/api/rewards/user/:userId',
    MODIFY_REWARD: '/api/rewards/:Id',
    DELETE_REWARD: '/api/rewards/:Id',

    QUERY_HISTORY: '/api/history/',
}