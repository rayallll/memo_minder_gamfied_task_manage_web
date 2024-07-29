# History Routes Documentation

## Fetch User's History

**Endpoint**: `GET /api/history/:userId`

**Description**: Retrieves historical data for a specific user.

**Parameters**:
- `userId`: String (required) - The unique identifier of the user for whom to fetch the history.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `history`: Object - Historical data for the specified user.
    - `user`: String - The user ID.
    - `todosAdded`: Number - Total number of todos added by the user.
    - `todosCompleted`: Number - Total number of todos completed by the user.
    - `habitsAdded`: Number - Total number of habits added by the user.
    - `habitsCompleted`: Number - Total number of habits completed by the user.
    - `dailiesAdded`: Number - Total number of dailies added by the user.
    - `dailiesCompleted`: Number - Total number of dailies completed by the user.
    - `rewardsAdded`: Number - Total number of rewards added by the user.
    - `rewardsCompleted`: Number - Total number of rewards completed by the user.

## Error Responses

### 404 Not Found

- If no history data is found for the specified user.

### 500 Internal Server Error

- If an internal server error occurs during the request processing.