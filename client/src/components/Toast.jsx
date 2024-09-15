import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Import the error icon

const Toast = ({ open, onClose, message, severity }) => {
    
    const icon = severity === 'error' ? <ErrorOutlineIcon style={{ color: 'red' }} /> : <CheckCircleOutline style={{ color: 'green' }} />;

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
            <Alert
                onClose={onClose}
                icon={icon}
                severity={severity} // severity can be 'success', 'error', etc.
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;