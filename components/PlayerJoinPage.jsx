import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { playerJoinGameFromBackend } from '../Backend-provider';
import { useParams, useNavigate } from 'react-router-dom';
import useErrorSnackbar from './PopupError';

// This component renders the page for a player to join a quiz session.
const PlayerJoinPage = () => {
  const [playerName, setPlayerName] = useState('');
  const { game_id, session_id } = useParams();
  const navigate = useNavigate();
  const { triggerError } = useErrorSnackbar();

  const handleJoin = async () => {
    try {
      // Send request to backend to join the game session with player name
      const result = await playerJoinGameFromBackend(session_id, playerName);
      const playerId = result.playerId;
      // Navigate to the player's game page
      navigate(`/player/${playerId}/game/${game_id}/session/${session_id}`);
    } catch (err) {
      triggerError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      gap={2}
    >
      <Typography variant="h5">Enter Your Name to Join</Typography>
      <TextField
        label="Player Name"
        variant="outlined"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleJoin}
        disabled={!playerName.trim()}
        aria-label='join this game'
      >
        Join
      </Button>
    </Box>
  );
};

export default PlayerJoinPage;