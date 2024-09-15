import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';


const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EventForm = ({ open, onClose, eventToEdit, onSubmit }) => {
    const [formValues, setFormValues] = useState(eventToEdit);

    useEffect(() => {
        if (eventToEdit) {
            setFormValues({
                ...eventToEdit,
                trans_tms: formatDateTimeLocal(eventToEdit.trans_tms)
            });
        }
    }, [eventToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = () => {
        // Ensure event count is at least 1
        if (formValues.event_cnt < 1) {
            setFormValues({ ...formValues, event_cnt: 1 });
        }
        onSubmit(formValues);
        onClose();
    };

    const handleClose = () => {
        setFormValues(eventToEdit);
        onClose()
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{eventToEdit ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Transaction ID"
                    name="trans_id"
                    value={formValues.trans_id}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Client ID"
                    name="client_id"
                    value={formValues.client_id}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Timestamp"
                    name="trans_tms"
                    type="datetime-local"
                    value={formValues.trans_tms}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Ensures the label does not overlap the input value
                    }}
                />
                <TextField
                    margin="dense"
                    label="RC Number"
                    name="rc_num"
                    value={formValues.rc_num}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Event Count"
                    name="event_cnt"
                    type="number"
                    value={formValues.event_cnt}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{
                        min: 1, // Minimum value for event count
                    }}
                />
                <TextField
                    margin="dense"
                    label="Location Code"
                    name="location_cd"
                    value={formValues.location_cd}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Address Number"
                    name="addr_nbr"
                    value={formValues.addr_nbr}
                    onChange={handleInputChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">{eventToEdit ? 'Update' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventForm;
