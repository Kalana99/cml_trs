from crud.models import Event

class EventService:
    def get_all_events(self):
        return Event.objects.all()

    def get_event_by_id(self, event_id):
        return Event.objects.filter(event_id=event_id).first()

    def create_event(self, data):
        event = Event(**data)
        event.save()
        return event

    def update_event(self, event_id, data):
        event = Event.objects.filter(event_id=event_id).first()
        if event:
            for key, value in data.items():
                setattr(event, key, value)
            event.save()
        return event

    def delete_event(self, event_id):
        event = Event.objects.filter(event_id=event_id).first()
        if event:
            event.delete()
        return event
