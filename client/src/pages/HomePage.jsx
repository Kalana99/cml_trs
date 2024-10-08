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
    addEventBulk,
    updateEvent,
    deleteEvent
} from '../services/api_helper';
import { formatDateTimeLocal } from '../utils/utils';


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

const HomePage = () => {

    const [openAddEventForm, setOpenAddEventForm] = useState(false);
    const [openBulkUploadForm, setOpenBulkUploadForm] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isFormAdd, setIsFormAdd] = useState(true);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [events, setEvents] = useState([]);
    const [toastSeverity, setToastSeverity] = useState('success');
    const [toastMessage, setToastMessage] = useState('');

    const handleFetchEvents = async () => {

        try {
            const response = await fetchEvents();

            if (response.error !== null) {
                setToastSeverity('error');
                setToastMessage(response.error.detail);
            }
            else {
                setEvents(response.data);
            }
        } 
        catch (error) {
            setToastSeverity('error');
            setToastMessage('Failed to fetch events. Please try again.');
        }
    }

    useEffect(() => {

        const loadEvents = async () => {
            await handleFetchEvents();
        };

        loadEvents();
    }, []);

    const handleAddEvent = () => {
        setIsFormAdd(true);
        setEventToEdit(DEFAULT_EVENT);
        setOpenAddEventForm(true);
    };

    const handleBulkUpload = () => {
        setOpenBulkUploadForm(true);
    };

    const handleEditEvent = (event) => {
        setIsFormAdd(false);
        setEventToEdit(event);
        setOpenAddEventForm(true);
    };

    const handleDeleteEvent = (event) => {
        setEventToDelete(event);
        setOpenConfirmDialog(true);
    };

    const submitEvent = async (event) => {

        try {
            let response = null
            let toastSuccessMessage = ''

            if (!isFormAdd) {
                response = await updateEvent(eventToEdit.event_id, event);
                toastSuccessMessage = 'Event updated successfully!';
            }
            else{
                response = await addEvent(event);
                toastSuccessMessage = 'Event added successfully!';
            }

            if (response.error !== null) {
                setToastSeverity('error');
                setToastMessage(response.error.detail);
                setShowSuccessToast(true);
            }
            else {
                setToastSeverity('success');
                setToastMessage(toastSuccessMessage);
                setShowSuccessToast(true);
                setOpenAddEventForm(false);
                setEventToEdit(null);
                await handleFetchEvents();
            }
        }
        catch (error) {
            setToastSeverity('error');
            setToastMessage('Failed to add the event. Please try again.');
            setShowSuccessToast(true);
        }
    };

    const submitEventBulk = async (events) => {
        
        try {
            const response = await addEventBulk(events);
            
            if (response.error !== null) {
                setToastSeverity('error');
                setToastMessage(response.error.detail);
                setShowSuccessToast(true);
            }
            else if (response.data.added_count === 0) {
                setToastSeverity('error');
                setToastMessage('Failed to add events. Please try again.');
                setShowSuccessToast(true);
            }
            else if (response.data.failed_count > 0) {
                setToastSeverity('warning');
                setToastMessage(`Added events: ${response.data.added_count}. Failed events: ${response.data.failed_count}. Please check the data and try again.`);
                setShowSuccessToast(true);
                setOpenBulkUploadForm(false);
                await handleFetchEvents();
            }
            else {
                setToastSeverity('success');
                setToastMessage(`${response.data.added_count} Events added successfully!`);
                setShowSuccessToast(true);
                setOpenBulkUploadForm(false);
                await handleFetchEvents();
            }
        }
        catch (error) {
            setToastSeverity('error');
            setToastMessage('Failed to add the events. Please try again.');
            setShowSuccessToast(true);
        }
    };

    const confirmDeleteEvent = async () => {

        try {
            const response = await deleteEvent(eventToDelete.event_id);
    
            if (response.error !== null) {
                setToastSeverity('error');
                setToastMessage(response.error.detail);
            } 
            else {
                setToastSeverity('success');
                setToastMessage('Event deleted successfully!');
                await handleFetchEvents();
            }
        } 
        catch (error) {
            setToastSeverity('error');
            setToastMessage('Failed to delete the event. Please try again.');
        }

        setShowSuccessToast(true);
        setOpenConfirmDialog(false);
    };

    return (
        <Container sx={{ marginTop: '70px', maxWidth: '100%' }}>
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
                onSubmit={submitEvent}
                formatDateTimeLocal={formatDateTimeLocal}
                isFormAdd={isFormAdd}
            />

            <BulkUploadForm
                open={openBulkUploadForm}
                onSubmit={submitEventBulk}
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
