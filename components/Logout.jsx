import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AUTH from '../constants'; 
import Button from '@mui/material/Button';
import useErrorSnackbar from './PopupError';

// Logout button component that accepts a setToken function as a prop
function LogoutButton({ setToken }) {
  const navigate = useNavigate();
  const { triggerError } = useErrorSnackbar();

  const logout = async () => {
    try {
      // Logout from the backend
      const token = localStorage.getItem(AUTH.TOKEN_KEY);
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      localStorage.removeItem(AUTH.TOKEN_KEY);
      setToken(null);
      // Redirect user to homepage after logout
      navigate('/login');
    } catch (err) {
      triggerError(err.response?.data?.error || 'Logout failed');
    }
  }

  return <Button color="inherit" onClick={logout} aria-label='logout'>Logout</Button>;
}

export default LogoutButton;
