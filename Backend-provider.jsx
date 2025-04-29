import axios from 'axios';
import AUTH from "./constants";

const handleError = (err) => {
  const errorMsg = err?.response?.data?.error || 'Unknown error occurred';
  throw new Error(errorMsg);
};

// Get all games info for the login users
export const getAllGames = async () => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.get('http://localhost:5005/admin/games', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Update multiple games owned by the admin
export const updateGameList = async (updatedGames) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.put('http://localhost:5005/admin/games', {
      games: updatedGames,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      }
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Post status (start) of games to the backend
export const startGameFromBackend = async (gameId) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.post(
      `http://localhost:5005/admin/game/${gameId}/mutate`,
      {
        mutationType: 'start',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Advanced the state of games to the backend, change for the position
export const advanceGameFromBackend = async (gameId) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.post(
      `http://localhost:5005/admin/game/${gameId}/mutate`,
      {
        mutationType: 'advance',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// End games status to the backend
export const endGameFromBackend = async (gameId) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.post(
      `http://localhost:5005/admin/game/${gameId}/mutate`,
      {
        mutationType: 'end',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

// Get the status of game session to the admin
export const getGameStatusFromBackend = async (sessionId) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.get(
      `http://localhost:5005/admin/session/${sessionId}/status`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Post a new player to the backend when joining an active session
export const playerJoinGameFromBackend = async (sessionId, name) => {
  try {
    const res = await axios.post(
      `http://localhost:5005/play/join/${sessionId}`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Used to check whether in the lobby room or play the game
export const getPlayerStatusFromBackend = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5005/play/${id}/status`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Get questions to the players
export const getPlayerQuestionFromBackend = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5005/play/${id}/question`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Record the player answers, it need to sent to the server immediately after each user interaction.
export const recordPlayerAnswerFromBackend = async (id, answerContent) => {
  try {
    const res = await axios.put(
      `http://localhost:5005/play/${id}/answer`,
      { answers: answerContent },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// When timer is finished, get the correct answers for the question showing to the player
export const getCorrectAnswerFromBackend = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5005/play/${id}/answer`,
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Collect player's own performance to see the result
export const getPlayerResultFromBackend = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5005/play/${id}/results`,
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// Get all players results for the specific game session
export const getAdminResultFromBackend = async (sessionId) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  try {
    const res = await axios.get(
      `http://localhost:5005/admin/session/${sessionId}/results`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
