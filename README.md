# BigBrain

BigBrain is a web-based quiz management platform that allows administrators to create, edit, and manage multiplayer quizzes, and allows players to participate in real-time games.

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



