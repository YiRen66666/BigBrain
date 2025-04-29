import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { startGameFromBackend, getAllGames } from '../Backend-provider';
import PopupDialog from './PopupSession';
import useErrorSnackbar from './PopupError';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [latestGame, setLatestGame] = useState(game);
  const [isActive, setIsActive] = useState(game.active || false);
  const { triggerError, ErrorSnackbar } = useErrorSnackbar();

  const StyledImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px',
  });

  // Check if game is ready to start (all questions valid)
  const canStart = latestGame.questions.length > 0 &&
    latestGame.questions.every(q => q.duration > 0 && q.correctAnswers.length > 0);
  // Get all invalid questions for error reporting
  const invalidQuestions = latestGame.questions.filter(q =>
    q.duration <= 0 || q.correctAnswers.length === 0
  );

  // Get the latest game info from backend
  useEffect(() => {
    const fetchLatestGame = async () => {
      const res = await getAllGames();
      const found = res.games.find(g => g.id === game.id);
      if (found) {
        setLatestGame(found);
        setIsActive(found.active || false);
        if (found.active) {
          // If the game is active, set the session ID for later use
          setSessionId(found.active);
        }
      }
    };
    fetchLatestGame();
  }, [game.id]);

  // Navigate to the edit page of this game
  const toEditEachGame = async () => {
    const res = await getAllGames();
    const found = res.games.find(g => g.name === game.name);
    if (found?.id) {
      navigate(`/game/${found.id}`);
    } else {
      triggerError("Game not ready yet, please try again.");
    }
  };

  // Start a new session for the game
  const startGameState = async (id) => {
    try {
      const res = await startGameFromBackend(id);
      setSessionId(res.data.sessionId);
      setPopupOpen(true);
      setIsActive(true);
    } catch (err) {
      triggerError(`${err.message}` || 'Failed to start game');
    }
  };

  // Continue an already active session as admin
  const continueSessionAsAdmin = async (sessionId) => {
    navigate(`/admin/${latestGame.id}/session/${sessionId}`);
  };

  return (
    <>
      {ErrorSnackbar}
  
      {/* Popup dialog for session ID */}
      <PopupDialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Game Started"
        content={`Session ID: ${sessionId}`}
        confirmText="Copy Session Link"
        onConfirm={() => {
          navigator.clipboard.writeText(`http://localhost:3000/player/join/${latestGame.id}/session/${sessionId}`);
          setPopupOpen(false);
        }}
      />
  
      {/* Main content area */}
      <section aria-label={`Game card section for ${latestGame.name}`}>
        <Card sx={{ width: 300 }} aria-label={`Game card for ${latestGame.name}`}>
          {/* Game header image */}
          <header>
            <Box sx={{ position: 'relative', height: 140 }}>
              <StyledImage
                src={latestGame.thumbnail || 'default.jpg'}
                alt={`Thumbnail for game ${latestGame.name}`}
              />
            </Box>
          </header>
  
          {/* Main game details */}
          <article>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                {latestGame.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Owner: {latestGame.owner}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {latestGame.questions?.length === 0
                  ? "⏳ Waiting for admin to edit questions"
                  : `${latestGame.questions.length} questions · total duration: ${latestGame.questions.reduce((sum, q) => sum + q.duration, 0)}s`}
              </Typography>
            </CardContent>
  
            {/* Action buttons */}
            <CardActions>
              <Button size="small" onClick={toEditEachGame} aria-label={`Edit game ${latestGame.name}`}>
                Edit game
              </Button>
              <Button
                size="small"
                aria-label={isActive ? "Continue session page" : "Start game"}
                onClick={() => {
                  if (!canStart) {
                    triggerError(
                      <>
                        Cannot start game:<br />
                        - You have {invalidQuestions.length} invalid question(s)<br />
                        - Each question needs:<br />
                        &nbsp;&nbsp;• Duration &gt; 0<br />
                        &nbsp;&nbsp;• At least 1 correct answer
                      </>
                    );
                  } else if (isActive && sessionId) {
                    continueSessionAsAdmin(sessionId);
                  } else {
                    startGameState(latestGame.id);
                  }
                }}
                sx={{
                  color: canStart ? 'primary.main' : 'grey.500',
                  pointerEvents: canStart ? 'auto' : 'auto',
                }}
              >
                {isActive ? "Continue session page" : "Start Game"}
              </Button>
            </CardActions>
          </article>
        </Card>
      </section>
    </>
  );
}
export default GameCard;
