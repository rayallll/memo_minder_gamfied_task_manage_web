# Reward Routes Documentation

## Add Reward

**Endpoint**: `POST /api/rewards`

**Description**: Adds a new reward to the database for the authenticated user.

**Request Body**:
- `title`: String (required) - The title of the reward.
- `note`: String (optional) - Additional notes about the reward.
- `cost`: Number (required) - The cost of the reward in coins.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 201 Created
- **Body**:
  - `message`: String - Confirmation message.
  - `reward`: Object - Details of the added reward.

## Fetch User's Rewards

**Endpoint**: `GET /api/rewards/user/:userId`

**Description**: Retrieves all rewards belonging to a specific user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `rewards`: Array - Array of reward objects belonging to the user.
  
## Modify Reward

**Endpoint**: `PUT /api/rewards/:rewardId`

**Description**: Modifies an existing reward identified by `rewardId` for the authenticated user.

**Request Body**:
- `title`: String (optional) - The updated title of the reward.
- `note`: String (optional) - The updated notes about the reward.
- `cost`: Number (optional) - The updated cost of the reward in coins.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `reward`: Object - Updated reward details.

## Delete Reward

**Endpoint**: `DELETE /api/rewards/:rewardId`

**Description**: Deletes a reward identified by rewardId for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.


## Complete Reward

**Endpoint**: `PUT /api/rewards/:rewardId/complete`

**Description**: Marks a reward identified by rewardId as completed for the authenticated user.

**Authorization**: Requires a valid JWT token in the request header.

**Response**:
- **Status**: 200 OK
- **Body**:
  - `message`: String - Confirmation message.
  - `reward`: Object - Details of the completed reward.

## Reward Object

- `_id`: String - Unique identifier for the reward.
- `title`: String - The title of the reward.
- `note`: String (optional) - Additional notes about the reward.
- `cost`: Number - The cost of the reward in coins.
- `user`: String - The user ID to which the reward belongs.
- `completed`: Boolean - Indicates whether the reward is completed.