import React, { useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const EventTable = ({ events, handleEditEvent, handleDeleteEvent }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleOpenMenu = (event, eventData) => {
        setAnchorEl(event.currentTarget);
        setSelectedEvent(eventData);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleCloseMenu();
        handleEditEvent(selectedEvent);
    };

    const handleDelete = () => {
        handleCloseMenu();
        handleDeleteEvent(selectedEvent);
    };

    return (
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #cecece', marginBottom: '30px' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'black' }}>
                        <TableCell sx={{ color: 'white' }}>#</TableCell>
                        <TableCell sx={{ color: 'white' }}>Event ID</TableCell>
                        <TableCell sx={{ color: 'white' }}>Transaction ID</TableCell>
                        <TableCell sx={{ color: 'white' }}>Client ID</TableCell>
                        <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
                        <TableCell sx={{ color: 'white' }}>RC Number</TableCell>
                        <TableCell sx={{ color: 'white' }}>Event Count</TableCell>
                        <TableCell sx={{ color: 'white' }}>Location Code</TableCell>
                        <TableCell sx={{ color: 'white' }}>Address Number</TableCell>
                        <TableCell sx={{ color: 'white' }}>Location ID 1</TableCell>
                        <TableCell sx={{ color: 'white' }}>Location ID 2</TableCell>
                        <TableCell sx={{ color: 'white' }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={event.event_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{event.event_id}</TableCell>
                            <TableCell>{event.trans_id}</TableCell>
                            <TableCell>{event.client_id}</TableCell>
                            <TableCell>
                                {dayjs(event.trans_tms).isValid() ? dayjs(event.trans_tms).format('DD-MM-YYYY HH:mm:ss') : 'N/A'}
                            </TableCell>
                            <TableCell>{event.rc_num}</TableCell>
                            <TableCell>{event.event_cnt}</TableCell>
                            <TableCell>{event.location_cd}</TableCell>
                            <TableCell>{event.addr_nbr ? event.addr_nbr : "-"}</TableCell>
                            <TableCell>{event.location_id1 ? event.location_id1 : "-"}</TableCell>
                            <TableCell>{event.location_id2 ? event.location_id2 : "-"}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={(e) => handleOpenMenu(e, event)}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                    <MenuItem onClick={handleEdit}>
                                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                                    </MenuItem>
                                    <MenuItem onClick={handleDelete}>
                                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventTable;
