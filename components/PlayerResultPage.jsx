import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayerResultFromBackend, getGameStatusFromBackend } from '../Backend-provider';
import { Box, Typography, Paper } from '@mui/material';
import useErrorSnackbar from './PopupError';

const ResultPage = () => {
  const { player_id, session_id } = useParams();
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { triggerError } = useErrorSnackbar();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Get how the player answered, true or false?
        const res = await getPlayerResultFromBackend(player_id);
        setResults(res);
        // Aimed to get the point if player win the game, though index to track which question
        const sessionStatus = await getGameStatusFromBackend(session_id);
        setQuestions(sessionStatus.results.questions);

      } catch (err) {
        triggerError(err.messgae);
      }
    };

    fetchResult();
  }, [player_id, session_id]);

  return (
    <Box p={4}>
      {/* Show final score by summing up correct question points */}
      <Typography variant="h4" gutterBottom>
        🎉 Game Results: You got {results.reduce((acc, r, i) => { return r.correct ? acc + (questions[i]?.point || 0) : acc; }, 0)} points!
      </Typography>

      {/* If no results yet, show message. Otherwise show details per question */}
      {results.length === 0 ? (
        <Typography>No results available.</Typography>
      ) : (
        results.map((result, index) => {
          const timeTaken = result.answeredAt && result.questionStartedAt
            ? Math.floor((new Date(result.answeredAt) - new Date(result.questionStartedAt)) / 1000)
            : 'N/A';

          const point = result.correct ? (questions[index]?.point || 0) : 0;

          return (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Question {index + 1}</Typography>
              <Typography>✅ Correct: {result.correct ? 'Yes' : 'No'}</Typography>
              <Typography>🎯 Score: {point} points</Typography>
              <Typography>
                🕒 Time Taken: {timeTaken === 'N/A' ? 'Not answered' : `${timeTaken} seconds`}
              </Typography>
              <Typography>
                📝 Your Answer: {result.answers.length > 0 ? result.answers.join(', ') : 'None'}
              </Typography>
              <Typography>
                ✅ Correct Answer: {questions[index]?.correctAnswers?.join(', ') || 'N/A'}
              </Typography>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default ResultPage;