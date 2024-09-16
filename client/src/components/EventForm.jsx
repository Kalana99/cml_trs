import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { validate as isValidUUID } from 'uuid'; // For generating UUID


const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const DEFAULT_EVENT = {
    event_id: '',
    trans_id: '',
    client_id: '',
    trans_tms: formatDateTimeLocal(new Date()),
    rc_num: '',
    event_cnt: 1,
    location_cd: '',
    addr_nbr: '',
    location_id1: '',
    location_id2: '',
}

const EventForm = ({ open, onClose, eventToEdit, onSubmit, backendErrors }) => {
    const [formValues, setFormValues] = useState(DEFAULT_EVENT);
    const [errors, setErrors] = useState({});
    const [formChanged, setFormChanged] = useState(false); // Track if any field has changed

    useEffect(() => {
        if (eventToEdit) {
            setFormValues({
                ...eventToEdit,
                trans_tms: formatDateTimeLocal(eventToEdit.trans_tms),
            });
        }
    }, [eventToEdit]);

    // Utility function to check if form is empty (for add case)
    const validateFormForAdd = () => {
        const newErrors = {};
        if (!formValues.trans_id || !isValidUUID(formValues.trans_id)) newErrors.trans_id = 'Transaction ID is required and should be a UUID.';
        if (!formValues.client_id) newErrors.client_id = 'Client ID is required.';
        if (!formValues.trans_tms) newErrors.trans_tms = 'Timestamp is required.';
        if (!formValues.rc_num) newErrors.rc_num = 'RC Number is required.';
        if (!formValues.event_cnt || formValues.event_cnt < 1) newErrors.event_cnt = 'Event Count must be at least 1.';
        if (!formValues.location_cd) newErrors.location_cd = 'Location Code is required.';
        return newErrors;
    };

    // Utility function to validate form changes (for edit case)
    const validateFormForEdit = () => {
        const newErrors = {};

        // Check if any field has changed
        const changedFields = Object.keys(formValues).some(key => formValues[key] !== eventToEdit[key]);

        // If trans_id has changed, validate its format
        if (formValues.trans_id !== eventToEdit.trans_id && !isValidUUID(formValues.trans_id)) {
            newErrors.trans_id = 'Transaction ID should be a valid UUID.';
        }

        // Return errors if any, otherwise check if no fields have changed
        return Object.keys(newErrors).length === 0
            ? (changedFields ? {} : { form: 'No fields have changed.' })
            : newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setFormChanged(true);
    };

    const handleSubmit = () => {
        let newErrors = {};
        if (eventToEdit) {
            // Editing an event
            newErrors = validateFormForEdit();
        } else {
            // Adding a new event
            newErrors = validateFormForAdd();
        }

        // If no errors, submit the form
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formValues);
            onClose();
        } else {
            setErrors(newErrors);
        }
    };

    const handleClose = () => {
        setFormValues(DEFAULT_EVENT);
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {eventToEdit ? 'Edit Event' : 'Add Event'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {backendErrors && <Typography color="error">{backendErrors}</Typography>}

                <TextField
                    margin="dense"
                    label="Transaction ID"
                    name="trans_id"
                    value={formValues.trans_id}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={!!errors.trans_id}
                    helperText={errors.trans_id}
                    // disabled={!!eventToEdit} // Disable for edit
                />
                <TextField
                    margin="dense"
                    label="Client ID"
                    name="client_id"
                    value={formValues.client_id}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={!!errors.client_id}
                    helperText={errors.client_id}
                />
                <TextField
                    margin="dense"
                    label="Timestamp"
                    name="trans_tms"
                    type="datetime-local"
                    value={formValues.trans_tms}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.trans_tms}
                    helperText={errors.trans_tms}
                />
                <TextField
                    margin="dense"
                    label="RC Number"
                    name="rc_num"
                    value={formValues.rc_num}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={!!errors.rc_num}
                    helperText={errors.rc_num}
                />
                <TextField
                    margin="dense"
                    label="Event Count"
                    name="event_cnt"
                    type="number"
                    value={formValues.event_cnt}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    error={!!errors.event_cnt}
                    helperText={errors.event_cnt}
                />
                <TextField
                    margin="dense"
                    label="Location Code"
                    name="location_cd"
                    value={formValues.location_cd}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={!!errors.location_cd}
                    helperText={errors.location_cd}
                />
                <TextField
                    margin="dense"
                    label="Address Number"
                    name="addr_nbr"
                    value={formValues.addr_nbr}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Location ID 1"
                    name="location_id1"
                    value={formValues.location_id1}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Location ID 2"
                    name="location_id2"
                    value={formValues.location_id2}
                    onChange={handleInputChange}
                    fullWidth
                />

                {errors.form && <Typography color="error">{errors.form}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary" disabled={!formChanged}>
                    {eventToEdit ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventForm;
