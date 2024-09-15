import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const BulkUploadForm = ({ open, onClose }) => {
    const handleSubmit = () => {
        // Implement the bulk upload logic here
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Bulk Upload Events</DialogTitle>
            <DialogContent>
                <input type="file" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkUploadForm;
