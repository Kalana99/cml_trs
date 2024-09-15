from django.urls import path
from .views import create_event, create_events_batch, get_events, update_event, delete_event

urlpatterns = [
    path('create-event/', create_event, name='create-event'),
    path('create-events-batch/', create_events_batch, name='create-events-batch'),
    path('get-events/', get_events, name='get-events'),
    path('update-event/<str:event_id>/', update_event, name='update-event'),
    path('delete-event/<str:event_id>/', delete_event, name='delete-event'),
]