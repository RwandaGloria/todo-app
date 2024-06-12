# TodoApp

Welcome to TodoApp! This is an API designed for managing to-do tasks and uses JWT Based Authentication


# Installation

 1. Clone the repository : `git clone https://github.com/RwandaGloria/todo-app`
 2.  Switch to the main branch: `git checkout main`
 3.  Navigate to the project directory
 4.  Install dependencies : `npm i`
 5.  Create .env file in root directory with the following variables defined: 
 
  - `PORT=3400`
   - `SQL_USER_NAME=root`
   - `SQL_DB_NAME=todoapp`
   - `SQL_PASSWORD=<SQL-PASSWORD>`
   - `SQL_PORT=3306`
   - `SQL_HOST=localhost`
   - `JWT_SECRET_KEY=<YOUR_SECRET-KEY>`

To run the app, enter `npm start`  in terminal
To start the tests, enter `npm test` 


## How to Use
The following endpoints require user-authentication before accessing
POST  `/api/v1/user/todos/`
GET `/api/v1/user/todos/`
GET `/api/v1/user/todos/:id`
PUT `/api/v1/user/todos/:id`
DELETE `/api/v1/user/todos/:id`

To authenticate, users must sign up or log in by accessing the appropriate route:

- `POST /api/v1/user/signup`
- `POST /api/v1/user/login`


Upon successful authentication, users will receive a JSON Web Token (JWT). To access the protected endpoints, users must include the JWT in the Authorization header as Bearer <token>. This will enable users to access the mentioned routes.

The API documentation for TodoApp is available at `/api/v1/docs`. You can access it in your web browser after starting the server.
