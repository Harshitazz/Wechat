# We-Chat

[Live Demo](https://we-chat-9doc.onrender.com)

## Overview
We-Chat is a real-time chat application powered by **Socket.IO**, offering instant messaging, group chat functionality, and secure authentication. Built with a focus on user experience and security, it features **Chakra UI**, **JWT/OAuth authentication**, and **data encryption**.

## Features
- **Real-time messaging with Socket.IO**
- **Secure authentication using JWT/OAuth**
- **Group chat functionality with participant management and admin controls**
- **Chakra UI for an enhanced user experience**
- **Data encryption and input validation for security**

## Tech Stack
- **Frontend**: React.js, Chakra UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT/OAuth
- **Real-time communication**: Socket.IO
- **Deployment**: Render


### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/We-Chat.git
   cd We-Chat
   ```

2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```sh
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory and add:
   ```sh
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

5. Run the backend server:
   ```sh
   npm start
   ```

6. Run the frontend development server:
   ```sh
   cd ../frontend
   npm start
   ```

7. Open the application in your browser at:
   ```
   http://localhost:3000
   ```


Enjoy chatting on We-Chat! 🚀
