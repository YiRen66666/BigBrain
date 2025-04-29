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

## Demo

Here are some screenshots of BigBrain in action:

### Admin Dashboard
![3d5ae0afda186942652c5d09f6c856e](https://github.com/user-attachments/assets/f9ba878b-988b-4cde-a73f-f9fe4ca4d7a1)


### Player Lobby Room
![343dc4201aeead25653d9a89ec054a5](https://github.com/user-attachments/assets/fc96d3a9-05a3-434a-a802-73efa9817894)


### Game Start Page
![7a1eabfc711326f3d4c04f7f2a330b2](https://github.com/user-attachments/assets/ca7a2b76-0bdf-4051-bf7a-68d5be075bb2)

### Game Result Page （Admin view）
![image](https://github.com/user-attachments/assets/a347f810-c07a-4b80-9c15-13166ca856c6)


