# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run your app
CMD ["npm", "start"]
