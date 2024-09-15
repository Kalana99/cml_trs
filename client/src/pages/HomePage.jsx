import React, { useState, useEffect } from 'react';

import {
    Container,
    Typography,
    Box,
    Button
} from '@mui/material';

import EventTable from '../components/EventTable';
import EventForm from '../components/EventForm';
import BulkUploadForm from '../components/BulkUploadForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

import {
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
} from '../services/api_helper';


const DEFAULT_EVENT = {
    event_id: '',
    trans_id: '',
    client_id: '',
    trans_tms: '',
    rc_num: '',
    event_cnt: 1,
    location_cd: '',
    addr_nbr: ''
}

const HomePage = () => {
    const [openAddEventForm, setOpenAddEventForm] = useState(false);
    const [openBulkUploadForm, setOpenBulkUploadForm] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(DEFAULT_EVENT);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [events, setEvents] = useState([]);
    const [toastSeverity, setToastSeverity] = useState('success');
    const [toastMessage, setToastMessage] = useState('');

    const handleFetchEvents = async () => {
        const eventList = await fetchEvents();
        setEvents(eventList);
    }

    useEffect(() => {
        const loadEvents = async () => {
            await handleFetchEvents();
        };
        loadEvents();
    }, []);

    const handleAddEvent = () => {
        setEventToEdit(DEFAULT_EVENT);
        setOpenAddEventForm(true);
    };

    const handleBulkUpload = () => {
        setOpenBulkUploadForm(true);
    };

    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setOpenAddEventForm(true);
    };

    const handleDeleteEvent = (event) => {
        setEventToDelete(event);
        setOpenConfirmDialog(true);
    };

    const confirmDeleteEvent = async () => {
        const response = await deleteEvent(eventToDelete.event_id);

        if (response) {
            setToastSeverity('success');
            setToastMessage('Event deleted successfully!');
        } else {
            setToastSeverity('error');
            setToastMessage('Failed to delete the event. Please try again.');
        }

        setShowSuccessToast(true);
        setOpenConfirmDialog(false);
    };

    return (
        <Container sx={{ marginTop: '70px' }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddEvent}
                    sx={{ borderRadius: '8px' }}
                >
                    Add Event
                </Button>
                <Typography
                    variant="h4"
                    color="primary"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                >
                    Event Management
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBulkUpload}
                    sx={{ borderRadius: '8px' }}
                >
                    Bulk Upload Events
                </Button>
            </Box>

            <EventTable
                events={events}
                handleEditEvent={handleEditEvent}
                handleDeleteEvent={handleDeleteEvent}
            />

            <EventForm
                open={openAddEventForm}
                onClose={() => setOpenAddEventForm(false)}
                eventToEdit={eventToEdit}
                setEventToEdit={setEventToEdit}
                onSubmit={() => setShowSuccessToast(true)}
            />

            <BulkUploadForm
                open={openBulkUploadForm}
                onClose={() => setOpenBulkUploadForm(false)}
            />

            <ConfirmDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={confirmDeleteEvent}
                message="Are you sure you want to delete this event?"
            />

            <Toast
                open={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                message={toastMessage}
                severity={toastSeverity}
            />
        </Container>
    );
};

export default HomePage;
