import { useState, useEffect } from 'react';
import * as React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useParams } from 'react-router-dom';
import { getAllGames, updateGameList } from '../Backend-provider';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import PopupDialog from './PopupSession';
import useErrorSnackbar from './PopupError';
import { styled } from '@mui/system';

// Modal window style
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

const EachGame = () => {
  const navigate = useNavigate();

  const [gameInfo, setGameInfo] = useState(null);
  const [gameName, setGameName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [questionInfo, setQuestionInfo] = useState([]);
  //Extract user_id parameters from the URL
  const { game_id } = useParams();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [question, setQuestion] = useState([]);

  const [popupOpen, setPopupOpen] = useState(false);

  // popup error and msg
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { triggerError, ErrorSnackbar } = useErrorSnackbar();

  //Hide inputs
  const HiddenInput = styled('input')({
    display: 'none',
  });


  // Set default game name once data is loaded
  useEffect(() => {
    if (gameInfo?.name) {
      setGameName(gameInfo.name);
    }
  }, [gameInfo]);

  // Take all the game data from the back end, find the corresponding game, and then initialize it into each state variable (title, cover, question)
  useEffect(() => {
    getAllGames()
      .then((result) => {
        const searchGame = result.games.find(
          (game) => String(game.id) === game_id
        );
        if (searchGame) {
          setGameInfo(searchGame);
          setGameName(searchGame.name);
          setThumbnail(searchGame.thumbnail);
          setQuestionInfo(searchGame.questions);
        }
      });
  }, [game_id]);

  // Modify the name and thumbnail of current game, and then update them back to backend
  const readyToUpdateGame = () => {
    getAllGames()
      .then(res => {
        const oldGames = res.games || [];
        const updatedGames = oldGames.map(eachGame => {
          if (String(eachGame.id) === game_id) {
            return {
              ...eachGame,
              name: gameName,
              thumbnail: thumbnail
            };
          }
          return eachGame;
        });

        updateGameList(updatedGames)
          .then(() => {
            setShowSaveDialog(true);

          })
          .catch(err => {
            triggerError("Failed to update game: " + (err?.message || 'Unknown error'));
          });
      })
  }

  const editQuestion = (id) => {
    navigate(`/game/${game_id}/question/${id}`);
  }


  const deleteQuestion = (questionId) => {
    getAllGames()
      .then(res => {
        const oldGames = Array.isArray(res.games) ? res.games : [];
        const searchGame = oldGames.find(game => String(game.id) === game_id);

        if (!searchGame) return;

        // Delete corresponding question
        const filteredQuestions = searchGame.questions.filter(q => q.id !== questionId);

        const updatedQuestionGame = {
          ...searchGame,
          questions: filteredQuestions
        };

        // Replace the original game
        const updatedGames = oldGames.map(game =>
          String(game.id) === game_id ? updatedQuestionGame : game
        );

        updateGameList(updatedGames)
          .then(() => {
            setQuestionInfo(filteredQuestions); // trigger re-rendering
          })
          .catch(err => {
            triggerError("Failed to delete question: " + (err?.message || 'Unknown error'));
          });
      });
  };


  const addNewQuestion = (question) => {
    getAllGames()
      .then(res => {
        const oldGames = Array.isArray(res.games) ? res.games : [];
        // Find the current game being edited by ID
        const searchGame = oldGames.find(game => String(game.id) === game_id);
        // Get the current list of questions (fallback to empty array)
        const currentQuestions = Array.isArray(searchGame.questions) ? searchGame.questions : [];
        // Find the highest question ID to generate a new unique one
        const maxId = currentQuestions.reduce((max, q) => Math.max(max, q.id || 0), 0);
        // Create a new question object with default values
        const addQuestion = {
          question: question,
          duration: 0,
          point: 0,
          type: "",
          optionAnswers: [],
          correctAnswers: [],
          media: "",
          id: maxId + 1
        };
        // Update the current game with the new question
        const updatedQuestionGame = {
          ...searchGame,
          questions: [...searchGame.questions, addQuestion]
        };
        // Replace this updated game in the full game list
        const updatedQuestionGames = oldGames.map(eachOriginGame =>
          String(eachOriginGame.id) === game_id ? updatedQuestionGame : eachOriginGame
        );
        // Send updated game list back to backend
        updateGameList(updatedQuestionGames)
          .then(() => {
            setQuestion('');
            handleClose();
            setQuestionInfo([...currentQuestions, addQuestion]);
          })
          .catch(err => {
            triggerError("Failed to update question: " + (err?.message || 'Unknown error'));
          });
      })
  }
  if (!game_id) return <div>loading!</div>
  return (
    <div>
      {ErrorSnackbar}
      <Button variant="outlined" onClick={handleOpen} aria-label="Add a new question to this game" >
        ADD a new question
      </Button>

      <PopupDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        title="Changes Saved"
        content="Your changes have been successfully saved!"
        confirmText="OK"
      />

      <PopupDialog // pop up session of uploading thrumbnail
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Upload"
        content="Upload Success ✅"
        confirmText="OK"
      />

      <Container>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <br /><br />
          {gameInfo && (
            <Typography variant="h4" gutterBottom>
              Edit game:  {gameName}
            </Typography>
          )}

          <TextField
            id="outlined-required"
            label="game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />

          <br /><br />

          <label htmlFor="upload-thumbnail">
            <HiddenInput
              accept="image/*"
              id="upload-thumbnail"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setThumbnail(reader.result);
                    setPopupOpen(true);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              aria-label="Upload a thumbnail image for this game"
            >
              Upload Thumbnail
            </Button>
          </label>
          {thumbnail && (
            <Box mt={2}>
              <Typography variant="subtitle2">Thumbnail Preview:</Typography>
              <Box
                component="img"
                src={thumbnail}
                alt="Game thumbnail preview"
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '8px',
                  mt: 1,
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}

          <br /><br />
          <Button variant="contained" onClick={readyToUpdateGame} aria-label="Save changes to game title and thumbnail">
            Save Changes
          </Button>

          {questionInfo.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold">Edit questions for this game:</Typography>
              <Box display="flex" justifyContent="flex-start" mt={2}>
              </Box>
              {questionInfo.map((q, index) => (
                <Box key={q.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Typography>
                    Q{index + 1}: {q.question || <Typography sx={{ color: 'gray' }}>No title</Typography>}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {q.id} | Duration: {q.duration} | Points: {q.point}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 'auto' }}>
                    <Button variant="outlined" onClick={() => editQuestion(q.id)} aria-label={`Edit question ${index + 1}`}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteQuestion(q.id)} aria-label={`Delete question ${index + 1}`}>DELETE</Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>


      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Add questions" fullWidth margin="normal"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => addNewQuestion(question)}
            >
              Add!
            </Button>
          </Box>
        </Box>
      </Modal>

    </div>

  );
};

export default EachGame;
