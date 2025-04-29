import { Link } from 'react-router-dom';
import LogoutButton from './Logout';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function NavBar({ token, setToken }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* App title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BigBrain
          </Typography>
          {/* Conditionally render login/register or logout */}
          {token ? (
            <LogoutButton setToken={setToken} />
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register" aria-label='Register'>
                Register
              </Button>
              {/* logout always exists for the authenticated users */}
              <Button color="inherit" component={Link} to="/login" aria-label='oogin'>
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
