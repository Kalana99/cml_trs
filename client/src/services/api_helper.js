import api from './api';

export const fetchEvents = async () => {
    
    try {
        const response = await api.get('api/get-events/');
        return response.data;
    } 
    catch (error) {
        console.error('[api_helper - fetchEvents] Error fetching events: ', error);
        throw error;
    }
};

export const addEvent = async (eventData) => {
    
    try {
        const response = await api.post('api/create-event/', eventData);
        return response.data;
    } 
    catch (error) {
        console.error('[api_helper - addEvent] Error adding event: ', error);
        throw error;
    }
};

export const addEventBulk = async (eventData) => {
    
    try {
        const response = await api.post('api/create-events-batch/', eventData);
        return response.data;
    } 
    catch (error) {
        console.error('[api_helper - addEventBulk] Error adding event bulk: ', error);
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    
    try {
        const response = await api.put(`api/update-event/${eventId}/`, eventData);
        return response.data;
    } 
    catch (error) {
        console.error('[api_helper - updateEvent] Error updating event: ', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {

    try {
        const response = await api.delete(`api/delete-event/${eventId}/`);
        return response.data;
    } 
    catch (error) {
        console.error('[api_helper - deleteEvent] Error deleting event: ', error);
        throw error;
    }
};
