import api from './api';

export const fetchEvents = async () => {
    // Fetch events from your backend
    return [
        {
            "event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "trans_id": "0000abf8-d1f5-4536-8fb0-36fe934b1f28",
            "trans_tms": "2024-09-14T10:20:30Z",
            "rc_num": "10001",
            "client_id": "1111cccc-22dd-33ee-44ff-555566667777",
            "event_cnt": 1,
            "location_cd": "DESTINATION",
            "location_id1": "X12",
            "location_id2": "Y34",
            "addr_nbr": "1234567890"
        },
        {
            "event_id": "e25d9b44-2333-4b56-b8a9-9a890d213f35",
            "trans_id": "0001bbf9-d3f6-5536-9fa1-46fe928b5a28",
            "trans_tms": "2024-09-14T11:45:00Z",
            "rc_num": "10002",
            "client_id": "2222dddd-33ee-44ff-55gg-666677778888",
            "event_cnt": 2,
            "location_cd": "CUSTOMER NUMBER",
            "location_id1": "C98",
            "location_id2": "D45",
            "addr_nbr": "0987654321"
        },
        {
            "event_id": "d47b2d92-a8e2-40e4-9ec8-47bd2f47b3d6",
            "trans_id": "1000def7-a3b4-4536-bfc0-87cb12345678",
            "trans_tms": "2024-09-14T12:10:50Z",
            "rc_num": "10003",
            "client_id": "3333eeee-44ff-55gg-66hh-777788889999",
            "event_cnt": 3,
            "location_cd": "OUTLET ID",
            "location_id1": "O56",
            "location_id2": "P78",
            "addr_nbr": "8765432109"
        }
    ]

};

export const addEvent = async (eventData) => {
    // Add event to the backend
};

export const updateEvent = async (eventId, eventData) => {
    // Update event by id in the backend
};

export const deleteEvent = async (eventId) => {
    // Delete event by id in the backend
    return false;
};
