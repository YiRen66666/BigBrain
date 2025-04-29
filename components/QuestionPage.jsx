import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Checkbox,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel,
  Box, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllGames, updateGameList } from '../Backend-provider';
import useErrorSnackbar from './PopupError';
import PopupDialog from './PopupSession';
import { styled } from '@mui/system';

// Converts a normal YouTube URL to an embeddable iframe URL
const convertToYoutubeEmbed = (url) => {
  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};
// customize the image style
const StyledImage = styled('img')({
  width: '100%',
  borderRadius: '8px',
  maxHeight: '400px',
  objectFit: 'contain',
});

// Main form state containing all fields related to a question
const EditQuestionPage = () => {
  const { game_id, question_id } = useParams();
  const { triggerError } = useErrorSnackbar();
  const [form, setForm] = useState({
    type: 'single',
    question: '',
    timeLimit: '',
    points: '',
    media: '',
    answers: ['', ''],
    correctAnswers: []
  });

  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Fetch question data when the component mounts
  useEffect(() => {
    (async () => {
      try {
        // Find the game with the matching game_id
        const { games } = await getAllGames();
        const game = games.find(g => String(g.id) === game_id);
        if (!game) return triggerError("Game not found");
        // From that game, finds the specific question to be edited.
        const q = game.questions.find(q => String(q.id) === question_id);
        if (!q) return triggerError("Question not found");
        const options = q.optionAnswers?.length >= 2 ? q.optionAnswers : ['', ''];
        const correct = (q.correctAnswers ?? []).map(String).filter(ans => options.includes(ans));
        // Filters them to make sure they're still valid options (e.g. if user had deleted one option).
        setForm({
          question: q.question ?? '',
          timeLimit: q.duration,
          points: q.point,
          type: q.type ?? '',
          media: q.media ?? '',
          answers: q.optionAnswers?.length >= 2 ? q.optionAnswers : ['', ''],
          correctAnswers: correct
        });
      } catch (err) {
        triggerError(err.messgae);
      }
    })();
  }, [game_id, question_id]);

  const handleChange = (key, value) => {
    if (key === 'type') {
      let updatedAnswers = form.answers;
      let updatedCorrect = [];
      // If the type is Judgement, answers are locked to ['True', 'False']. 
      // Otherwise (Single or Multiple), reset answers to empty inputs.
      if (value === 'judgement') {
        updatedAnswers = ['True', 'False']; 
        updatedCorrect = [];
      } else {
        updatedAnswers = ['', '', ''];
        updatedCorrect = [];
      }
      // Updates form state accordingly.
      setForm(prev => ({
        ...prev,
        type: value,
        answers: updatedAnswers,
        correctAnswers: updatedCorrect,
      }));
    } else {
      setForm(prev => ({ ...prev, [key]: value }));
    }
  };

  // Triggered when a user edits a specific answer option.
  // Updates the answers array at the correct index.
  const handleAnswerChange = (index, value) => {
    const updated = [...form.answers];
    updated[index] = value;
    setForm(prev => ({ ...prev, answers: updated }));
  };

  // This works for multiple-choice and is toggled manually.
  const toggleCorrect = (ans) => {
    let updated = [...form.correctAnswers];
    if (updated.includes(ans)) {
      updated = updated.filter(a => a !== ans);
    } else {
      updated.push(ans);
    }
    setForm(prev => ({ ...prev, correctAnswers: updated }));
  };

  const handleSubmit = async () => {
    try {
      // Finds the current question and updates its properties with the edited form values.
      const { games: allGames } = await getAllGames();
      const updatedGames = allGames.map(game => {
        if (game.id === parseInt(game_id)) {
          const updatedQuestions = game.questions.map(q => {
            if (q.id === parseInt(question_id)) {
              return {
                ...q,
                question: form.question,
                duration: form.timeLimit,
                point: form.points,
                type: form.type,
                media: form.media,
                optionAnswers: form.answers,
                correctAnswers: form.correctAnswers
              };
            }
            return q;
          });
          return { ...game, questions: updatedQuestions };
        }
        return game;
      });

      await updateGameList(updatedGames)
        .then(() => {
          setShowSaveDialog(true);
        })
    } catch (err) {
      triggerError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Edit{form.question ? `: ${form.question}` : ''} </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          value={form.type}
          label="Type"
          onChange={e => handleChange('type', e.target.value)}
        >
          <MenuItem value="single">Single Choice</MenuItem>
          <MenuItem value="multiple">Multiple Choice</MenuItem>
          <MenuItem value="judgement">Judgement</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Question"
        fullWidth
        margin="normal"
        value={form.question}
        onChange={e => handleChange('question', e.target.value)}
      />

      <TextField
        label="Time Limit (seconds)"
        type="number"
        fullWidth
        margin="normal"
        value={form.timeLimit}
        onChange={e => handleChange('timeLimit', parseInt(e.target.value))}
      />

      <TextField
        label="Points"
        type="number"
        fullWidth
        margin="normal"
        value={form.points}
        onChange={e => handleChange('points', parseInt(e.target.value))}
      />

      <TextField
        label="Media (YouTube/Image URL)"
        fullWidth
        margin="normal"
        value={form.media}
        onChange={e => handleChange('media', e.target.value)}
      />


      {form.media && (
        form.media.includes('youtube.com') || form.media.includes('youtu.be') ? (
          <Box mt={2}>
            <iframe
              width="100%"
              height="315"
              src={convertToYoutubeEmbed(form.media)}
              title="YouTube Video"
              aria-label="Embedded YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        ) : (
          <Box mt={2}>
            <StyledImage
              src={form.media}
              alt="media preview"
              aria-label="Image preview for the question"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )
      )}

      <Typography variant="h6" mt={3}>Answers</Typography>
      {form.answers.map((ans, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2} mt={1}>
          <TextField
            label={`Answer ${index + 1}`}
            value={ans}
            fullWidth
            onChange={e => handleAnswerChange(index, e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.correctAnswers.includes(ans)}
                onChange={() => {
                  if (form.type === 'judgement' || form.type === 'single') {
                    setForm(prev => ({ ...prev, correctAnswers: [ans] }));
                  } else {
                    toggleCorrect(ans);
                  }
                }}
              />
            }
            label="Correct"
          />
          {form.answers.length > 2 && (
            <IconButton onClick={() => {
              const deletedAnswer = form.answers[index];
              const newAnswers = form.answers.filter((_, i) => i !== index);
              const newCorrect = form.correctAnswers.filter(a => a !== deletedAnswer.toString());

              setForm(prev => ({
                ...prev,
                answers: newAnswers,
                correctAnswers: newCorrect
              }));
            }}
            aria-label={`Delete answer ${index + 1}`}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      {form.answers.length < 6 && form.type !== 'judgement' && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => handleChange('answers', [...form.answers, ''])}
          aria-label="Add new answer field"
        >
          Add Answer
        </Button>
      )}

      <Box mt={4}>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} aria-label="Save question changes">
          Save
        </Button>
      </Box>
      <PopupDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        title="Saved!"
        content="Your question has been successfully saved."
      />
    </Container>
  );
};

export default EditQuestionPage;
