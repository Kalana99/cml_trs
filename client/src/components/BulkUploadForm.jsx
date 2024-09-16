import React, { useCallback, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';


const SAMPLE_JSON = JSON.stringify({
	"batch_id": "0310abf6-d1f5-a1b3-8fb0-36fe934b1f28",
    "records": [
     { 
		"trans_id": "0000abf8-d1f5-4536-8fb0-36fe934b1f28",
		"trans_tms": "20151022102011927EDT",
		"rc_num": "10002",
		"client_id": "RPS-00001",
		"event": [
			{
				"event_cnt": 1,
				"location_cd": "DESTINATION",
				"location_id1": "T8C",
				"location_id2": "1J7",
				"addr_nbr": "0000000001"
			},
			{
				"event_cnt": 1,
				"location_cd": "CUSTOMER NUMBER",
				"location_id1": "0007316971"
			},
			{
				"event_cnt": 1,
				"location_cd": "OUTLET ID",
				"location_id1": "I029"
			}
		]
	},
	{ 
		"trans_id": "0000abf8-d1f5-4536-8fb0-36fe934b1f28",
		"trans_tms": "20151022102011927EDT",
		"rc_num": "10002",
		"client_id": "RPS-00001",
		"event": [
			{
				"event_cnt": 1,
				"location_cd": "DESTINATION",
				"location_id1": "T8C",
				"location_id2": "1J7",
				"addr_nbr": "0000000001"
			},
			{
				"event_cnt": 1,
				"location_cd": "CUSTOMER NUMBER",
				"location_id1": "0007316971"
			},
			{
				"event_cnt": 1,
				"location_cd": "OUTLET ID",
				"location_id1": "I029"
			}
		]
	},
	{ 
		"trans_id": "0000abf8-d1f5-4536-8fb0-36fe934b1f28",
		"trans_tms": "20151022102011927EDT",
		"rc_num": "10002",
		"client_id": "RPS-00001",
		"event": [
			{
				"event_cnt": 1,
				"location_cd": "DESTINATION",
				"location_id1": "T8C",
				"location_id2": "1J7",
				"addr_nbr": "0000000001"
			},
			{
				"event_cnt": 1,
				"location_cd": "CUSTOMER NUMBER",
				"location_id1": "0007316971"
			},
			{
				"event_cnt": 1,
				"location_cd": "OUTLET ID",
				"location_id1": "I029"
			}
		]
	}
	]	
}, null, 4);

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

    const downloadSampleJson = () => {
        const blob = new Blob([SAMPLE_JSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-template.json';
        a.click();
        URL.revokeObjectURL(url);
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

                <Button
                    onClick={downloadSampleJson}
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                >
                    Download Sample File
                </Button>
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
