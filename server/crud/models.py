import uuid
from django.db import models
from django.utils import timezone

LOCATION_CHOICES = [
        ('DESTINATION', 'Destination'),
        ('CUSTOMER NUMBER', 'Customer Number'),
        ('OUTLET ID', 'Outlet ID'),
    ]

class Event(models.Model):
    
    event_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trans_id = models.UUIDField()  # UUID to store the transaction ID
    trans_tms = models.DateTimeField(default=timezone.now)  # Timestamp of the transaction
    rc_num = models.CharField(max_length=100)  # A field for the rcNum value (can be adjusted for length)
    client_id = models.CharField(max_length=100)  # Client ID reference
    event_cnt = models.IntegerField(default=1)  # Integer for event count
    location_cd = models.CharField(max_length=100, choices=LOCATION_CHOICES)  # Code for location
    location_id1 = models.CharField(max_length=50, blank=True, null=True)  # First location ID
    location_id2 = models.CharField(max_length=50, blank=True, null=True)  # Second location ID
    addr_nbr = models.CharField(max_length=50, blank=True, null=True)  # Address number

    def __str__(self):
        return f'Event {self.event_id} - Client {self.client_id}'
