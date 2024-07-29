# Habit Routes Documentation

## Add Habit

**Endpoint**: `POST /api/habits`

**Description**: Adds a new habit to the database for the authenticated user.

**Request Body**:
- `title`: String (required) - The title of the habit.
- `note`: String (optional) - Additional notes about the habit.
- `type`: String (required) - The type of the habit (positive, negative, both, neutral).

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 201 Created
- **Body**:
  - `message`: String - Confirmation message.
  - `habit`: Object - Details of the added habit.

## Fetch User's Habits

**Endpoint**: `GET /api/habits/user/:userId`

**Description**: Retrieves all habits belonging to a specific user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `habits`: Array - Array of habit objects belonging to the user.
  
## Modify Habit

**Endpoint**: `PUT /api/habits/:habitId`

**Description**: Modifies an existing habit identified by `habitId` for the authenticated user.

**Request Body**:
- `title`: String (optional) - The updated title of the habit.
- `note`: String (optional) - The updated notes about the habit.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `habit`: Object - Updated habit details.

## Delete Habit

**Endpoint**: `DELETE /api/habits/:habitId`

**Description**: Deletes a habit identified by habitId for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.

## Increment Positive Counter

**Endpoint**: `PUT /api/habits/:habitId/increment/positive`

**Description**: Increments the positive counter for a habit identified by habitId.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `habit`: Object - Updated habit details.

## Increment Negative Counter

**Endpoint**: `PUT /api/habits/:habitId/increment/negative`

**Description**: Increments the negative counter for a habit identified by habitId.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `habit`: Object - Updated habit details.

## Habit Object

- `_id`: String - Unique identifier for the habit.
- `title`: String - The title of the habit.
- `note`: String (optional) - Additional notes about the habit.
- `type`: String - The type of the habit (positive, negative, both, neutral).
- `positiveCount`: Number (conditional) - The positive counter for the habit (available if type is positive or both).
- `negativeCount`: Number (conditional) - The negative counter for the habit (available if type is negative or both).
- `user`: String - The user ID to which the habit belongs.