# Todo Routes Documentation

## Add Todo

**Endpoint**: `POST /api/todos`

**Description**: Adds a new todo to the database for the authenticated user.

**Request Body**:
- `title`: String (required) - The title of the todo.
- `note`: String (optional) - Additional notes about the todo.
- `dueDate`: Date (required) - The due date of the todo.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 201 Created
- **Body**:
  - `message`: String - Confirmation message.
  - `todo`: Object - Details of the added todo.

## Fetch User's Todos

**Endpoint**: `GET /api/todos/user/:userId`

**Description**: Retrieves all todos belonging to a specific user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `todos`: Array - Array of todo objects belonging to the user.
  
## Modify Todo

**Endpoint**: `PUT /api/todos/:todoId`

**Description**: Modifies an existing todo identified by `todoId` for the authenticated user.

**Request Body**:
- `title`: String (optional) - The updated title of the todo.
- `note`: String (optional) - The updated notes about the todo.
- `dueDate`: Date (optional) - The updated due date of the todo.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `todo`: Object - Updated todo details.

## Delete Todo

**Endpoint**: `DELETE /api/todos/:todoId`

**Description**: Deletes a todo identified by todoId for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.

## Complete Todo

**Endpoint**: `PUT /api/todos/:todoId/complete`

**Description**: Marks a todo identified by `todoId` as completed for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `todo`: Object - Updated todo details with `completed` set to `true`.

## Todo Object

- `_id`: String - Unique identifier for the todo.
- `title`: String - The title of the todo.
- `note`: String (optional) - Additional notes about the todo.
- `dueDate`: Date (optional) - The due date of the todo.
- `user`: String - The user ID to which the habit belongs.
- `completed`: Boolean - Indicates whether the todo is completed.