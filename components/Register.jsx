import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AUTH from '../constants';
import useErrorSnackbar from './PopupError';


function Register(props) {
  const setToken = props.setFunc;
  // Form state variables
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Custom error snackbar handler
  const { triggerError, ErrorSnackbar, handleClose } = useErrorSnackbar();
  // Navigation hook
  const navigate = useNavigate();
  // Basic empty field validation
  const register = async () => {
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      triggerError("Please fill in all register information!");
      return;
    }
    // Password match check
    if (registerPassword !== registerConfirmPassword) {
      triggerError("Passwords do not match!");
      return;
    }

    try {
      // Send registration request to backend
      const res = await axios.post('http://localhost:5005/admin/auth/register', {
        email: registerEmail,
        password: registerPassword,
        name: registerName
      });
      // If successful, store token and redirect to dashboard
      const token = res.data.token;
      if (token) {
        localStorage.setItem(AUTH.USER_KEY, registerEmail);
        localStorage.setItem(AUTH.TOKEN_KEY, token);
        setToken(token);
        navigate('/dashboard');
      }
    } catch (err) {
      triggerError(err.response?.data?.error || 'Registration failed')
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm">
        {ErrorSnackbar}

        <form onSubmit={(e) => { e.preventDefault(); register(); }}>
          <Typography variant="h4" gutterBottom align="center">Register form</Typography>


          <TextField
            label="Name" fullWidth margin="normal" value={registerName} id="register-name"
            onChange={(e) => {
              setRegisterName(e.target.value);

            }}
          />
          <TextField
            label="Email" fullWidth margin="normal" value={registerEmail} id="Email"
            onChange={(e) => {
              setRegisterEmail(e.target.value);
            }}
          />
          <TextField
            label="Password" type="password" fullWidth margin="normal" value={registerPassword} id="Password"
            onChange={(e) => {
              setRegisterPassword(e.target.value);
            }}
          />
          <TextField
            label="Confirm Password" type="password" fullWidth margin="normal" value={registerConfirmPassword} id="Confirm Password"
            onChange={(e) => {
              const value = e.target.value;
              setRegisterConfirmPassword(value);
              // receive an error popup before submission to guide users
              if (value.length === registerPassword.length) {
                if (value !== registerPassword) {
                  triggerError('Passwords do not match! Please enter again.');
                } else {
                  handleClose();
                }
              } else if (value.length < registerPassword.length) {
                triggerError('Passwords do not match! If you are still typing, please ignore');
              } else if (value.length > registerPassword.length) {
                triggerError('Extra characters detected. Passwords do not match!');
              }
            }}
          />
          <Button type="submit" variant="contained" fullWidth id="Register">
            REGISTER
          </Button>
        </form>
      </Container>
    </Box>
  )

}

export default Register;
