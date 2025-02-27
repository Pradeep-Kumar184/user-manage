# user-management Application

This is a backend application for a user management system where I implement a secure user management system with advanced features such as CRUD
operations, JWT authentication with refresh tokens, role-based access control, profile management,
password reset using OTP sent via email, data insertion from a JSON file, and optimized performance
using NOSQL mongoDb database, bcrypt for password hashing, and express-validator for input validation.



## Features


- User can view ,update,delete,read profile.
- User can update profile picture.
- Implement JWT token-based authentication with refresh tokens.
-Implement CRUD operations where every operation is protected and linked to the
 authenticated user.
-Use express-validator for validating inputs across all APIs, ensuring data integrity and
security.
-Implement forgot password functionality using OTP sent via email



## Technologies Used

- Node.js
- Express.js
- MongoDB


  
## Deployment

The application is deployed and can be accessed at the following link:

[Deployed Application](https://user-manage-2.onrender.com)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pradeep-Kumar184/user-manage.git


## Authentication API Routes

### Register User
- **Endpoint:** `POST /api/v1/auth/register`
- **Description:** Creates a new user.
- **Request Body:**  
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "yourpassword",
    "image": file
  }
### Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Description:** Authenticates a user and returns a JWT token..
- **Request Body:**  
  ```json
  {
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
### Get All Users (Admin Only)
- **Endpoint:** `GET /api/v1/auth/getAllUser`
- **Description:** Retrieves a list of all registered users. Admin access required.
- **Headers:**
- Authorization:  <JWT_TOKEN>


### Update Profile Image
- **Endpoint:** `PUT /api/v1/auth/updateProfileImage`
- **Description:** Updates the user's profile image.
- **Headers:**
- Authorization: Bearer <JWT_TOKEN>
- **Request (Form-Data):**
- image: <File>

### Update Profile
- **Endpoint:** `PUT /api/v1/auth/updateProfile`
- **Description:** Updates user profile details.
- **Headers:**
- Authorization: Bearer <JWT_TOKEN>
- **Request Body:**  
  ```json
  {
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
### Forgot Password
- **Endpoint:** `POST /api/v1/auth/forgot-password`
- **Description:**  Sends an OTP for password reset..
- **Request Body:**  
  ```json
  {
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
### Reset Password
- **Endpoint:** `POST /api/v1/auth/reset-password`
- **Description:** Resets user password using OTP.
- **Request Body:**  
  ```json
 {
  "email": "johndoe@example.com",
  "otp": "123456",
  "newPassword": "newpassword"
}

### Delete User (Admin Only)
- **Endpoint:** `DELETE /api/v1/auth/delete-user/:id`
- **Description:** Deletes a user by ID. Admin access required.
- **Headers:**  
-Authorization: Bearer <JWT_TOKEN>



