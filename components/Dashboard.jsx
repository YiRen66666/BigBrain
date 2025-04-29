import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import AUTH from '../constants';
import { getAllGames, updateGameList } from '../Backend-provider';
import GameCard from './GameCard';
import useErrorSnackbar from './PopupSession';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function Dashboard() {
  // State to control create game modal open/close
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Input value for new game title
  const [title, setTitle] = useState('');
  // Store all game data from the backend
  const [gameInfo, setGameInfo] = useState('');
  // Used to error popup using UI component, instead of alert
  const { triggerError, ErrorSnackbar } = useErrorSnackbar();

  // Process to post a new game to the backend
  const postNewGame = async (title) => {
    // Get the email field from local storage as owner, string type
    const owner = localStorage.getItem(AUTH.USER_KEY);
    try {
      const data = await getAllGames();
      const currentgame = Array.isArray(data.games) ? data.games : [];

      // Construct a new game with required structure according to (PUT/admin/games) API
      const addedGame = {
        name: title,
        thumbnail: '',
        owner: owner,
        questions: [],
      };

      // Add this constructed game to the current all games and send to backend
      const updatedGames = [...currentgame, addedGame];
      await updateGameList(updatedGames);

      // update new games immediately, without refresh
      setGameInfo((prev) => ({
        ...prev,
        games: [...prev.games, addedGame],
      }));

      handleClose();
    } catch (err) {
      triggerError(err.message || 'Failed to create game');
    }
  };

  // first loading
  useEffect(() => {
    getAllGames().then((data) => {
      setGameInfo(data);
    });
  }, []);
  return (
    <div>
      {ErrorSnackbar}

      {/* Create Button */}
      <Box display="flex" justifyContent={'flex-start' } mt={2}>
        <Button variant="outlined" onClick={handleOpen} aria-label="create game">
          Create Game
        </Button>
      </Box>

      <br />

      {/* Centered container for responsive cards */}
      <Box display="flex" justifyContent="center">
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2.8}
          justifyContent={{ xs: 'center', sm: 'flex-start'}}
        >
          {gameInfo.games?.map((game, index) => (
            <GameCard key={game.id ?? `game-${index}`} game={game} />
          ))}
        </Box>
      </Box>

      {/* Modal for creating game */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Game Title"
            fullWidth
            margin="normal"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Button variant="outlined" onClick={() => postNewGame(title)}>
            Create!
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Dashboard;
