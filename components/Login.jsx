import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AUTH from '../constants';
import useErrorSnackbar  from './PopupError';

function Login(props) {
  // props passed by app.jsx, used to update the token after successful login
  const setToken = props.setFunc;
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();
  // Used to popup when error occures
  const { triggerError, ErrorSnackbar } = useErrorSnackbar();

  const login = async () => {
    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:5005/admin/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      const token = res.data.token;
      // If token received, save to localStorage and global state, then navigate to dashboard
      if (token) {
        localStorage.setItem(AUTH.USER_KEY, loginEmail);
        localStorage.setItem(AUTH.TOKEN_KEY, token);
        setToken(token);
        navigate('/dashboard');
      }
    } catch (err) {
      triggerError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <form onSubmit={(e) => { e.preventDefault(); login(); }}>
          <Typography variant="h4" gutterBottom align="center">Login Form</Typography>
          <TextField
            label="Email" fullWidth margin="normal" value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
          />
          <TextField
            label="Password" type="password" fullWidth margin="normal" value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
          <Button type="submit" variant="contained" fullWidth id='Login'>Login</Button>
          {ErrorSnackbar}
        </form>
      </Container>
    </Box>
  );
}

export default Login;
