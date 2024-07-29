# User Routes Documentation

## Register

**Endpoint**: `POST /api/users`

**Description**: Register a new user.

**Request Body**:
- `username`: String (required) - The username of the user.
- `email`: String (required) - The email address of the user.
- `password`: String (required) - The password of the user.

**Response**:
- **Status**: 201 Created
- **Body**:
  - `message`: String - Confirmation message.
  - `username`: String - The username of the user.
  - `email`: String - The email address of the user.
  - `id`: String - userId.

## Login

**Endpoint**: `POST /api/login`

**Description**: Login with existing credentials.

**Request Body**:
- `username`: String (required) - The email or username of the user.
- `password`: String (required) - The password of the user.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `token`: String - JWT token for authentication.
  - `username`: String - The username of the user.
  - `email`: String - The email address of the user.
  - `id`: String - userId.