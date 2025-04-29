import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack} from '@mui/material';
import { getGameStatusFromBackend, advanceGameFromBackend, endGameFromBackend, getAllGames} from '../Backend-provider';
import PopupDialog from './PopupSession';
import useErrorSnackbar from './PopupError';
import { styled } from '@mui/system';

const GameSessionPage = () => {
  const { game_id, session_id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [latestGame, setLatestGame] = useState(null);

  const StatusCircle = styled('span')(({ status }) => ({
    color: status ? 'green' : 'red',
    fontSize: 18,
  }));

  const { triggerError, ErrorSnackbar } = useErrorSnackbar();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getGameStatusFromBackend(session_id);
        setSessionData(res.results);
      } catch (err) {
        triggerError(`Failed to fetch session data: ${err.message}`);
      }
    };
    fetchStatus();
  }, [session_id]);
  // Used to get all games to get the total number of questions, so that if the last question is reached
  // 'NEXT QUESTION' button is hidden, that helps to improve the robustness
  useEffect(() => {
    const fetchLatestGame = async () => {
      const res = await getAllGames();
      const found = res.games.find(g => String(g.id) === game_id);
      if (found) setLatestGame(found);
    };
    fetchLatestGame();
  }, [game_id]);

  const advanceGameState = async (id) => {
    try {
      await advanceGameFromBackend(id);
      const updated = await getGameStatusFromBackend(session_id);
      setSessionData(updated.results);
    } catch (err) {
      triggerError(`Failed to advance game: ${err.message}`);
    }
  };

  const endGameState = async (id) => {
    try {
      await endGameFromBackend(id);
      const updated = await getGameStatusFromBackend(session_id);
      setSessionData(updated.results);
      setPopupOpen(true);
    } catch (err) {
      triggerError(`Failed to end game session: ${err.message}`);
    }
  };

  const recordPosition = sessionData?.position;
  const recordStatus = sessionData?.active;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" p={4}>
      {ErrorSnackbar}

      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          🎮 Admin Game Session
        </Typography>

        <Typography>📍 Current Position: <strong>{recordPosition}</strong></Typography>
        <Typography>
          <StatusCircle status={recordStatus}> {recordStatus ? '🟢' : '🔴'} </StatusCircle>
          <strong style={{ marginLeft: 8 }}>Active Status: {String(recordStatus)}</strong>
        </Typography>

        <Stack direction="row" spacing={2} mt={3}>
          {latestGame && recordPosition + 1 < latestGame.questions.length && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => advanceGameState(game_id)}
              aria-label={recordPosition === -1 ? "Start the game" : "Go to next question"}
            >
              {recordPosition === -1 ? "Start Game" : "Next Question"}
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={() => endGameState(game_id)}
            aria-label="End the game session"
          >
            End this session!
          </Button>
        </Stack>
      </Paper>

      <PopupDialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Session Ended"
        content="Would you like to view the results?"
        confirmText="Yes"
        onConfirm={() => {
          setPopupOpen(false);
          navigate(`/admin/result/${game_id}/session/${session_id}`);
        }}
      />
    </Box>
  );
};

export default GameSessionPage;
