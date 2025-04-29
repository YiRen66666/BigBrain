import { Box, Typography, Button } from '@mui/material';
import { useState } from 'react'; 

// LobbyRoom component shown before the game starts
const LobbyRoom = () => {
  // Control the small game
  const [showGame, setShowGame] = useState(false);
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        color: '#fff',
        textShadow: '2px 2px 8px #ff00ff',
        textAlign: 'center',
      }}
    >
      {/* Background video for lobby aesthetic */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/lobbyroom.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Foreground content: Lobby title, message, and optional mini-game */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          px: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={2}>
          You are now in the Lobby Room
        </Typography>

        <Typography variant="h6" gutterBottom>
          Please wait for the admin to start the game
        </Typography>

        <Button
          variant="contained"
          onClick={() => setShowGame(prev => !prev)}
          aria-label={showGame ? "Exit embedded table tennis game" : "Play embedded table tennis game"}
          sx={{
            mt: 6,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: showGame
              ? 'linear-gradient(to right, #ff3333, #990000)'
              : 'linear-gradient(to right, #ff00cc, #3333ff)',
            color: 'white',
            '&:hover': {
              background: showGame
                ? 'linear-gradient(to right, #ff6666, #cc0000)'
                : 'linear-gradient(to right, #ff33cc, #6666ff)',
            },
          }}
        >
          {showGame ? '🚪 EXIT GAME' : 'Feel boring? 🏓 COME PLAY TABLE TENNIS!'}
        </Button>

        {/* Render embedded table tennis game only when showGame is true */}
        {showGame && (
          <Box mt={4} width="100%" maxWidth="600px">
            <iframe
              src="https://play.famobi.com/wrapper/table-tennis-world-tour/A1000-10"
              width="100%"
              height="400"
              style={{ border: 'none', borderRadius: '12px' }}
              title="Table Tennis Game"
              allowFullScreen
            ></iframe>
          </Box>
        )}


      </Box>
    </Box>
  );
};

export default LobbyRoom;
