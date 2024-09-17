from django.test import TestCase
from unittest.mock import patch
from crud.models import Event
from crud.services.event_service import EventService
from uuid import uuid4

class EventServiceTest(TestCase):
    
    def setUp(self):
        self.event_service = EventService()
        self.test_event = Event.objects.create(
            event_id=uuid4(),
            trans_id=uuid4(),
            trans_tms="2024-09-14T10:20:30Z",
            rc_num="10002",
            client_id="RPS-00001",
            event_cnt=1,
            location_cd="DESTINATION",
            addr_nbr="0000000001"
        )
        self.valid_event = {
            "event_id": uuid4(),
            "trans_id": uuid4(),
            "trans_tms": "2024-09-14T10:20:30Z",
            "rc_num": "10002",
            "client_id": "RPS-00001",
            "event_cnt": 1,
            "location_cd": "DESTINATION",
            "addr_nbr": "0000000001"
        }
        self.invalid_event = {
            "event_id": uuid4(),
            "trans_id": uuid4(),
            "trans_tms": "Invalid Timestamp",  # Simulate a failure
            "rc_num": "10002",
            "client_id": "RPS-00001",
            "event_cnt": 1,
            "location_cd": "DESTINATION",
            "addr_nbr": "0000000001"
        }
    
    def test_get_all_events(self):
        events = self.event_service.get_all_events()
        self.assertEqual(len(events), 1)
    
    def test_get_event_by_id(self):
        event = self.event_service.get_event_by_id(self.test_event.event_id)
        self.assertEqual(event.event_id, self.test_event.event_id)
    
    def test_create_event(self):
        data = {
            "event_id": uuid4(),
            "trans_id": uuid4(),
            "trans_tms": "2024-09-14T10:20:30Z",
            "rc_num": "10003",
            "client_id": "RPS-00002",
            "event_cnt": 1,
            "location_cd": "OUTLET ID",
            "addr_nbr": "0000000002"
        }
        event = self.event_service.create_event(data)
        self.assertIsNotNone(event)
        
    @patch.object(EventService, 'create_event')
    def test_create_events_batch(self, mock_create_event):
        # Simulate success for the first event and failure for the second
        mock_create_event.side_effect = [None, Exception('Failed to create event')]
        
        events = [self.valid_event, self.invalid_event]
        
        result = self.event_service.create_events_batch(events)
        
        # Check if the number of successfully added events is 1
        self.assertEqual(result['added_count'], 1)
        self.assertEqual(len(result['added']), 1)
        self.assertEqual(result['added'][0]['trans_id'], self.valid_event['trans_id'])

        # Check if the number of failed events is 1
        self.assertEqual(result['failed_count'], 1)
        self.assertEqual(len(result['failed']), 1)
        self.assertEqual(result['failed'][0]['trans_id'], self.invalid_event['trans_id'])

        # Verify that create_event was called twice
        self.assertEqual(mock_create_event.call_count, 2)
    
    def test_update_event(self):
        new_data = {
            "rc_num": "10004",
            "client_id": "RPS-00003"
        }
        updated_event = self.event_service.update_event(self.test_event.event_id, new_data)
        self.assertEqual(updated_event.rc_num, "10004")
        self.assertEqual(updated_event.client_id, "RPS-00003")
    
    def test_delete_event(self):
        self.event_service.delete_event(self.test_event.event_id)
        deleted_event = self.event_service.get_event_by_id(self.test_event.event_id)
        self.assertIsNone(deleted_event)
