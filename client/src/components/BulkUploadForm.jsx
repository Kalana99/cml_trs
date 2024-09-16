import React, { useCallback, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const BulkUploadForm = ({ open, onSubmit, onClose }) => {

    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles) => {

        const file = acceptedFiles[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = (event) => {

                try {

                    const jsonContent = JSON.parse(event.target.result);

                    setFileContent(jsonContent);
                    setFileName(file.name);
                    setError('');
                } 
                catch (e) {
                    setError('Invalid JSON file.');
                    setFileContent(null);
                    setFileName('');
                }
            };
            reader.readAsText(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'application/json',
        maxFiles: 1
    });

    const handleClose = () => {
        setFileContent(null);
        setFileName('');
        setError('');
        onClose();
    }

    const handleSubmit = () => {

        if (fileContent) {
            onSubmit(fileContent);
            handleClose();
        } 
        else {
            setError('Please upload a valid JSON file.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Bulk Upload Events</DialogTitle>
            <DialogContent>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #aaa',
                        padding: '20px',
                        textAlign: 'center',
                        backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <Typography>Drop the file here...</Typography>
                    ) : (
                        <Typography>
                            Drag 'n' drop a JSON file here, or click to select a file
                        </Typography>
                    )}
                </Box>

                {fileName && (
                    <Typography sx={{ mt: 2 }}>
                        Uploaded file: <strong>{fileName}</strong>
                    </Typography>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary" disabled={!fileContent}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkUploadForm;
