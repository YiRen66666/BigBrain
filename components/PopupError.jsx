import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


// Popup error message, make it as component as it will use several times
const useErrorSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const triggerError = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ErrorSnackbar = (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      sx={{ mt: 10 }}
    >
      <Alert severity="error" onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { triggerError, ErrorSnackbar, handleClose };
};

export default useErrorSnackbar;
