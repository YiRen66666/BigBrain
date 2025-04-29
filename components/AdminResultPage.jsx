import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGameStatusFromBackend, getAdminResultFromBackend } from '../Backend-provider';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useErrorSnackbar from './PopupError';

const AdminResultPage = () => {
  const { session_id } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const { triggerError, ErrorSnackbar } = useErrorSnackbar(); 

  useEffect(() => {
    const readyToGetGameInfo = async () => {
      try {
        const statusRes = await getGameStatusFromBackend(session_id);
        const questions = statusRes.results.questions;
        setQuestionData(questions);

        const resultRes = await getAdminResultFromBackend(session_id);
        const players = resultRes.results;
        setPlayerData(players);
      } catch (err) {
        triggerError("Failed to fetch session results: " + (err.message || 'Unknown error'));
      }
    };

    readyToGetGameInfo();
  }, [session_id]);

  const getTop5Players = () => {
    return playerData.map(p => {
      // Calculate total score for this player
      const total = p.answers.reduce((acc, ans, i) => {
        if (ans.correct) {
          // If the answer is correct, add corresponding question point
          const point = questionData[i]?.point || 0;
          return acc + point;
        }
        return acc;
      }, 0);
        // Return a new object with player name and their total score,
        // Sort players from highest to lowest score
      return { name: p.name, score: total };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
  };

  const getCorrectRateByQuestion = () => {
    return questionData.map((q, index) => {
      let correctCount = 0;
      // Loop through each player's answer to this question (by index)
      playerData.forEach(p => {
        if (p.answers[index]?.correct) correctCount++;
      });
      // Calculate correct rate: (correct / total) * 100
      return {
        question: `Q${index + 1}`,
        correctRate: playerData.length ? (correctCount / playerData.length) * 100 : 0,
      };
    });
  };

  const getAvgAnswerTime = () => {
    return questionData.map((q, index) => {
      let totalTime = 0;
      let count = 0;
      playerData.forEach(p => {
        const a = p.answers[index];
        // Only count if answer timestamp is valid
        if (a?.answeredAt && a?.questionStartedAt) {
          // Compute time difference (in milliseconds), then convert to seconds
          const delta = new Date(a.answeredAt) - new Date(a.questionStartedAt);
          totalTime += delta / 1000;
          count++;
        }
      });
      // Compute average time (in seconds)
      return {
        question: `Q${index + 1}`,
        avgTime: count ? (totalTime / count) : 0,
      };
    });
  };
  // Helper function to get longest correct streak for one player
  const getMaxContinueSuccess = (answers) => {
    let max = 0;
    let curr = 0;
    for (const ans of answers) {
      if (ans.correct) {
        curr++;
        max = Math.max(max, curr);
      } else {
        curr = 0;
      }
    }
    return max;
  };

  // Find the player with the longest correct streak
  const getStreakChampion = () => {
    let maxStreak = 0;
    let champion = null;
  
    playerData.forEach(p => {
      const streak = getMaxContinueSuccess(p.answers);
      if (streak > maxStreak) {
        maxStreak = streak;
        champion = { name: p.name, streak };
      }
    });
  
    return champion || { name: 'No one', streak: 0 };
  }

  return (
    <Box p={4}>
      {ErrorSnackbar}
      <Typography variant="h4" fontWeight="bold">Admin View - Session Result Summary</Typography>

      <Typography variant="h6" mt={4} fontWeight="bold">🏆 Top 5 Players by Score</Typography>
      {getTop5Players().map((p, i) => (
        <Typography key={i}>{i + 1}. {p.name}: {p.score} points</Typography>
      ))}

      <Typography variant="h6" mt={4} fontWeight="bold">📊 Correct Rate per Question (%)</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getCorrectRateByQuestion()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="correctRate" fill= "HSL(207, 80%, 76%)" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6" mt={4} fontWeight="bold">⏱ Average Answer Time (s)</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getAvgAnswerTime()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis domain={[0, dataMax => Math.ceil(dataMax * 1.1)]} />

          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avgTime" stroke="HSL(207, 80%, 54%)" />
        </LineChart>
      </ResponsiveContainer>

      <h3 fontWeight="bold">🔥 Longest Correct Streak</h3>
      {playerData.map(p => (
        <p key={p.name}>
          <Typography component="span" fontWeight="bold" fontSize="1.1rem" color="primary">
            {p.name}
          </Typography>{' '}
          achieved a streak of {getMaxContinueSuccess(p.answers)} correct answers
        </p>


      ))}

      <h3 fontWeight="bold">👑 Streak Champion</h3>
      <p>
        <Typography component="span" fontWeight="bold" fontSize="1.1rem" color="secondary">
          {getStreakChampion().name}
        </Typography>{' '}
        achieved the longest streak with {getStreakChampion().streak} correct answers in a row!
      </p>

    </Box>
  );
};

export default AdminResultPage;
