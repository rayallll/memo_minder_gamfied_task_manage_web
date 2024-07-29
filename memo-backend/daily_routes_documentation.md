# Daily Routes Documentation

## Add Daily

**Endpoint**: `POST /api/dailies`

**Description**: Adds a new daily to the database for the authenticated user.

**Request Body**:
- `title`: String (required) - The title of the daily.
- `note`: String (optional) - Additional notes about the daily.
- `startDate`: Date (required) - The start date of the daily.
- `repeats`: String (required) - Frequency of the daily (daily, weekly, monthly, yearly).
- `repeatEvery`: Number (required) - Repeat interval for the daily.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 201 Created
- **Body**:
  - `message`: String - Confirmation message.
  - `daily`: Object - Details of the added daily.

## Fetch User's Dailies

**Endpoint**: `GET /api/dailies/user/:userId`

**Description**: Retrieves all dailies belonging to a specific user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `dailies`: Array - Array of daily objects belonging to the user.
  
## Modify Daily

**Endpoint**: `PUT /api/dailies/:dailyId`

**Description**: Modifies an existing daily identified by `dailyId` for the authenticated user.

**Request Body**:
- `title`: String (optional) - The updated title of the daily.
- `note`: String (optional) - The updated notes about the daily.
- `startDate`: Date (optional) - The updated start date of the daily.
- `repeats`: String (optional) - The updated frequency of the daily (daily, weekly, monthly, yearly).
- `repeatEvery`: Number (optional) - The updated repeat interval for the daily.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `daily`: Object - Updated daily details.

## Delete Daily

**Endpoint**: `DELETE /api/dailies/:dailyId`

**Description**: Deletes a daily identified by dailyId for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.

## Complete Daily

**Endpoint**: `PUT /api/dailies/:dailyId/complete`

**Description**: Marks a daily identified by `dailyId` as completed for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `daily`: Object - Updated daily details with `completed` set to `true`.

## Daily Object

- `_id`: String - Unique identifier for the daily.
- `title`: String - The title of the daily.
- `note`: String (optional) - Additional notes about the daily.
- `startDate`: Date - The start date of the daily.
- `repeats`: String - Frequency of the daily (daily, weekly, monthly, yearly).
- `repeatEvery`: Number - Repeat interval for the daily.
- `completed`: Boolean - Indicates whether the daily is completed.
- `user`: String - The user ID to which the habit belongs.