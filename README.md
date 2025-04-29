# BigBrain
BigBrain is a web-based quiz management platform that allows administrators to create, edit, and manage multiplayer quizzes, and allows players to participate in real-time games.

Features
Admin Side
Register and log in as an admin.

Create, edit, and delete quiz games.

Add, edit, and delete quiz questions.

Start and manage game sessions (start, stop, advance questions).

View and download detailed session results.

Player Side
Join a game session using a session ID.

Answer quiz questions in real-time.

View final results after the game ends.

Tech Stack
Frontend: React.js

State Management: useState, useEffect, Context API

UI Components: Material-UI (MUI)

Routing: React Router

Backend Communication: RESTful API calls

Project Structure
bash
Copy
Edit
/components     # Reusable UI components
App.jsx         # Main app routing and layout
Backend-provider.jsx # API communication handlers
constants.js    # Configuration constants
main.jsx        # React app entry point
setup.js        # Global setups (e.g., axios defaults)
README.md       # Project documentation
How to Run Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/YiRen66666/BigBrain.git
cd BigBrain
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm start
Access the app at http://localhost:3000.

API Reference
This project communicates with a backend server via RESTful APIs for:

User authentication

Game creation and management

Session control

Real-time question/answer handling

Result retrieval

