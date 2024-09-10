# Product Management APIs

This is a Node.js backend application for managing products with user authentication.

## Setup

1. Clone the repository
2. First initialize: 'npm init -y'
3. Install dependencies: `npm install`
4. Create a `.env` file and add your `SECRET_KEY`
5. Set up your MongoDB connection in `config.js`

## Features

- User registration and login
- JWT authentication
- CRUD operations for products
- User-specific product management

## Main Components

- `config/`: Database configuration
- `middlewares/`: Authentication middleware
- `models/`: Mongoose models for users and products
- `index.js`: Main application file with API routes

## API Endpoints

- POST `/register`: User registration
- POST `/login`: User login
- GET `/products`: Fetch all products (authenticated)
- POST `/products/new`: Add a new product (authenticated)
- GET `/products/:id`: Fetch a specific product (authenticated)
- DELETE `/products/:id`: Delete a product (authenticated)
- GET `/users/:id/products`: Fetch all products for a specific user (authenticated)

## Running the Application

Start the server: node index.js

The API will be available at `http://localhost:5000`.

## Technologies Used

- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- cors
- dotenv
- bcryptjs
- body-parser
- nodemon (This package is very helpful when you make changes and want to see the results without restarting the server, it automatically restart the project)

For more details, please refer to the source code and comments within each file.

## For other projects present in this folder, same stuff exist in those, it was done only to practice repeatedly.
