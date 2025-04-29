# BigBrain

BigBrain is a web-based quiz management platform that allows administrators to create, edit, and manage multiplayer quizzes, and allows players to participate in real-time games.

# Sample Demo

![Admin](https://github.com/user-attachments/assets/864fc5ef-2a07-4804-9853-b0a0e7a32af4)
![Game](https://github.com/user-attachments/assets/1b2b3dc2-fe8f-48d0-a4c3-1bb29861f566)
![result](https://github.com/user-attachments/assets/6a4ed85c-e9ce-44da-b81b-4cc6993b260a)


## Features

### Admin Side
- Register and log in as an admin.
- Create, edit, and delete quiz games.
- Add, edit, and delete quiz questions.
- Start and manage game sessions (start, stop, advance questions).
- View and download detailed session results.

### Player Side
- Join a game session using a session ID.
- Answer quiz questions in real-time.
- View final results after the game ends.

## Tech Stack

- **Frontend:** React.js
- **State Management:** useState, useEffect, Context API
- **UI Components:** Material-UI (MUI)
- **Routing:** React Router
- **Backend Communication:** RESTful API calls

## Project Structure

/components # Reusable UI components App.jsx # Main app routing and layout Backend-provider.jsx # API communication handlers constants.js


## How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YiRen66666/BigBrain.git
cd BigBrain

# 2. Install dependencies
npm install

# 3. Start the development server
npm start




