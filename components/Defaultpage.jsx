import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const DefaultPage = (props) => {
  //convert to the boolean value
  const isLoggedIn = !!props.token;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Card sx={{ maxWidth: 600, p: 4, textAlign: 'center', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {isLoggedIn ? 'Welcome Back! 🎉' : 'Welcome to BigBrain 💡'}
          </Typography>
          

          <Typography variant="body1" sx={{ mb: 3 }}>
            {isLoggedIn
              ? 'Continue to explore!'
              : 'Start your journey!'}
          </Typography>

          {isLoggedIn && (
            <Box>
              <Button variant="contained" component={Link} to="/dashboard" aria-label="Go to the dashboard page">
                Go to dashboard
              </Button>
            </Box>
          )}

          {!isLoggedIn && (
            <Box>
              <Button variant="contained" component={Link} to="/register" aria-label="Go to registration page">
                Register
              </Button>
              <Button variant="outlined" component={Link} to="/login" sx={{ ml: 2 }}  aria-label="Go to login page">
                Login
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DefaultPage;

  