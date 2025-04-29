import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPlayerStatusFromBackend,
  getPlayerQuestionFromBackend,
  recordPlayerAnswerFromBackend,
  getCorrectAnswerFromBackend,
} from '../Backend-provider';
import {
  Box, Typography, FormControlLabel, Checkbox, FormGroup
} from '@mui/material';

import LobbyRoom from './LobbyRoom'
import useErrorSnackbar from './PopupError'
import { styled } from '@mui/system';

const PlayerGamePage = () => {
  const { player_id, session_id, game_id } = useParams();
  const navigate = useNavigate();

  const [started, setStarted] = useState(null);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selected, setSelected] = useState([]);
  const [sessionValid, setSessionValid] = useState(true);
  const [correctTexts, setCorrectTexts] = useState([]);
  const { triggerError, ErrorSnackbar } = useErrorSnackbar();

  const [showCorrect, setShowCorrect] = useState(false);
  // useRef to track selected answers even during async updates
  const selectedRef = useRef([]);

  const StyledLabel = styled('span')(({ showCorrect, correctTexts, opt }) => ({
    color: showCorrect && correctTexts.includes(opt) ? 'green' : 'inherit',
    fontWeight: showCorrect && correctTexts.includes(opt) ? 'bold' : 'normal',
  }));

  const handleAnswerClick = async (answer) => {
    let updatedAnswer;
    const type = question.question.type;
    // For multiple choice, allow toggling selections
    if (type === 'multiple') {
      updatedAnswer = selected.includes(answer)
        ? selected.filter(o => o !== answer)
        : [...selected, answer];
    } else {
      // For single/judgement type, only one option can be selected
      updatedAnswer = [answer];
    }

    setSelected(updatedAnswer);
    selectedRef.current = updatedAnswer;

    try {
      await recordPlayerAnswerFromBackend(player_id, updatedAnswer);
    } catch (err) {
      triggerError(err.message);
    }
  };
  // Show correct answers after time runs out
  const getCorrectAnswer = async () => {
    try {
      const result = await getCorrectAnswerFromBackend(player_id);

      if (question && result.answers) {
        const textAnswers = result.answers;
        setCorrectTexts(textAnswers);
        setShowCorrect(true);
      }
    } catch (err) {
      triggerError(err.message);
    }
  };


  // If session becomes invalid, redirect to results page
  useEffect(() => {
    if (!sessionValid) {
      navigate(`/result/player/${player_id}/game/${game_id}/session/${session_id}`);
    }
  }, [sessionValid]);

  // Poll backend every 200ms to check if game has started
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getPlayerStatusFromBackend(player_id);
        setStarted(res.started);
      } catch (err) {
        setSessionValid(false);
        triggerError(err.message);
      }
    };

    if (!sessionValid) return;
    const interval = setInterval(checkStatus, 200);
    return () => clearInterval(interval);
  }, [player_id, sessionValid]);

  // To avoid resetting question state unnecessarily
  const prevQ = useRef(null);

  useEffect(() => {
    if (!started || !sessionValid) return;
  
    const pollQuestion = async () => {
      try {
        const res = await getPlayerQuestionFromBackend(player_id);
        if (prevQ.current !== res.question.question) {
          setQuestion(res);
          setSelected([]);
          setShowCorrect(false);
          prevQ.current = res.question.question;
        }
      } catch (err) {
        setSessionValid(false);
        triggerError(err.message);
      }
    };
  
    const interval = setInterval(pollQuestion, 500);
    return () => clearInterval(interval);
  }, [started, player_id, sessionValid]);

  // Load questions initially once the game has started
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const res = await getPlayerQuestionFromBackend(player_id);
        setQuestion(res);
        setSelected([])
      } catch (err) {
        setSessionValid(false);
        triggerError(err.message);
      }
    };
    if (started && sessionValid) {
      fetchInitialQuestion();
    }
  }, [started, player_id, sessionValid]);

  // Countdown timer logic
  useEffect(() => {
    if (question && question.question.duration > 0) {
      setTimeLeft(question.question.duration);

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          // Show answers when time is up
          if (prev === 1) {
            clearInterval(timer);
            getCorrectAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [question]);

  // Render loading screen
  if (started === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }
  // Admin has not started the game, position still is 0
  if (!started) {
    return <LobbyRoom />;
  }
  // Main game UI
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} gap={2}>
      {question ? (
        <>
          <Typography variant="h5">Question: {question.question.question}</Typography>
          <Typography variant="h5">This question worths: {question.question.point}</Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            {question.question.type === 'single' && '🟢 Single choice: Select **one** correct answer!'}
            {question.question.type === 'multiple' && '🟢 Multiple are correct: select ALL correct answers'}
            {question.question.type === 'judgement' && '🟢 Choose True or False'}
          </Typography>

          {question.question.media && (
            question.question.media.includes('youtube') ? (
              <iframe
                width="400"
                height="300"
                src={question.question.media.replace('watch?v=', 'embed/')}
                title="YouTube video"
                aria-label={`Embedded YouTube video: ${question.question.question}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                src={question.question.media}
                alt="Media fail to load"
                aria-label={`Image preview for question: ${question.question.question}`}
                width="400"
              />
            )
          )}

          <Typography variant="body1">
            ⏳ Time left: {timeLeft} second{timeLeft === 1 ? '' : 's'}
          </Typography>

          <FormGroup>
            {question.question.optionAnswers.map((opt, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selected.includes(opt)}
                    onChange={() => handleAnswerClick(opt)}
                    color="primary"
                    disabled={timeLeft === 0}
                  />
                }
                label={
                  <StyledLabel showCorrect={showCorrect} correctTexts={correctTexts} opt={opt}>
                    {opt}
                  </StyledLabel>
                }
              />

            ))}
          </FormGroup>

          {timeLeft === 0 && (
            <Typography variant="body2" color="green">
              Correct answers shown above.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h5">Loading question...</Typography>
      )}
      {ErrorSnackbar}
    </Box>
  );
};

export default PlayerGamePage;
