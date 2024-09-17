from rest_framework.test import APITestCase
from rest_framework import status
from crud.models import Event
from crud.utils.HttpResponseUtil import INTERNAL_SERVER_ERROR_CODE, VALIDATION_ERROR_CODE, NOT_FOUND_ERROR_CODE
from uuid import uuid4

class EventAPITestCase(APITestCase):

    def setUp(self):
        self.event = Event.objects.create(
            event_id=uuid4(),
            trans_id=uuid4(),
            trans_tms="2024-09-14T10:20:30Z",
            rc_num="10002",
            client_id="RPS-00001",
            event_cnt=1,
            location_cd="DESTINATION",
            addr_nbr="0000000001"
        )
        self.create_url = '/api/create-event/'
        self.update_url = f'/api/update-event/{self.event.event_id}/'
        self.delete_url = f'/api/delete-event/{self.event.event_id}/'
        self.get_url = '/api/get-events/'
        self.create_url_batch = '/api/create-events-batch/'

    def test_create_event(self):
        data = {
            "event_id": str(uuid4()),
            "trans_id": str(uuid4()),
            "trans_tms": "2024-09-14T10:20:30Z",
            "rc_num": "10003",
            "client_id": "RPS-00002",
            "event_cnt": 1,
            "location_cd": "OUTLET ID",
            "addr_nbr": "0000000002"
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_events(self):
        response = self.client.get(self.get_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_update_event(self):
        update_data = {
            "trans_id": str(uuid4()),
            "trans_tms": "2024-09-14T10:20:30Z",
            "rc_num": "10004",
            "client_id": "RPS-00003",
            "event_cnt": 1,
            "location_cd": "DESTINATION",
            "addr_nbr": "0000000001"
        }
        response = self.client.put(self.update_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['rc_num'], "10004")

    def test_delete_event(self):
        response = self.client.delete(self.delete_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 0)
        
    def test_create_events_batch_success(self):
        # Valid event batch payload
        data = {
            "records": [
                {
                    "trans_id": str(uuid4()),
                    "trans_tms": "2024-09-14T10:20:30Z",
                    "rc_num": "10002",
                    "client_id": "RPS-00001",
                    "event": [
                        {
                            "event_cnt": 1,
                            "location_cd": "DESTINATION",
                            "location_id1": "T8C",
                            "location_id2": "1J7",
                            "addr_nbr": "0000000001"
                        }
                    ]
                },
                {
                    "trans_id": str(uuid4()),
                    "trans_tms": "2024-09-14T11:20:30Z",
                    "rc_num": "10003",
                    "client_id": "RPS-00002",
                    "event": [
                        {
                            "event_cnt": 1,
                            "location_cd": "OUTLET ID",
                            "location_id1": "I029"
                        }
                    ]
                }
            ]
        }

        # Send POST request to create event batch
        response = self.client.post(self.create_url_batch, data, format='json')
        
        # Check if the request was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('added_count', response.data['data'])
        self.assertEqual(response.data['data']['added_count'], 2)

    def test_create_events_batch_no_records(self):
        # Invalid payload (no records)
        data = {
            "records": []
        }

        response = self.client.post(self.create_url_batch, data, format='json')
        
        # Expect HTTP 400 due to no records
        self.assertEqual(response.data['error']['code'], VALIDATION_ERROR_CODE)
        self.assertIn('No records found', str(response.data['error']['detail']))

    def test_create_events_batch_invalid_trans_id(self):
        # Payload with invalid trans_id format
        data = {
            "records": [
                {
                    "trans_id": "invalid_uuid",  # Invalid UUID format
                    "trans_tms": "2024-09-14T10:20:30Z",
                    "rc_num": "10002",
                    "client_id": "RPS-00001",
                    "event": [
                        {
                            "event_cnt": 1,
                            "location_cd": "DESTINATION",
                            "location_id1": "T8C",
                            "location_id2": "1J7",
                            "addr_nbr": "0000000001"
                        }
                    ]
                }
            ]
        }

        # Send POST request with invalid trans_id
        response = self.client.post(self.create_url_batch, data, format='json')
        
        # Check that it returns HTTP 400 for validation error
        self.assertEqual(response.data['error']['code'], VALIDATION_ERROR_CODE)
        self.assertIn('Must Be A Valid Uuid.', response.data['error']['detail'][0]['trans_id'][0].title())

    def test_create_events_batch_serializer_error(self):
        # Payload with missing required fields (client_id)
        data = {
            "records": [
                {
                    "trans_id": str(uuid4()),
                    "trans_tms": "2024-09-14T10:20:30Z",
                    "rc_num": "10002",
                    # "client_id": "RPS-00001",  # Missing client_id
                    "event": [
                        {
                            "event_cnt": 1,
                            "location_cd": "DESTINATION",
                            "location_id1": "T8C",
                            "location_id2": "1J7",
                            "addr_nbr": "0000000001"
                        }
                    ]
                }
            ]
        }

        # Send POST request with missing fields
        response = self.client.post(self.create_url_batch, data, format='json')
        
        # Check that it returns HTTP 400 for missing fields
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('client_id', response.data['error']['detail'][0])  # Check for client_id field error
