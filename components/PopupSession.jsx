import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Popup message, make it as component as it will use several times
const PopupDialog = ({
  open = false,
  onClose = () => {},
  title = '',
  content = '',
  confirmText = 'OK',
  onConfirm = null
} = {}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label='close'>Close</Button>
        <Button onClick={onConfirm || onClose} aria-label={`Confirm action: ${confirmText}`}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;
