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
    
    def create_events_batch(self, events):
        
        success_events = []
        failed_events = []
        
        for event in events:
            
            try:
                self.create_event(event)
                success_events.append(event)
            except Exception as e:
                failed_events.append(event)
                
        return {"added": success_events, "added_count": len(success_events), "failed": failed_events, "failed_count": len(failed_events)}

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
